import { eq } from 'drizzle-orm';

import { Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { getTwilioClientOrg, getWhatsappSenders } from '@twilio/providers';

import tables from '@db/db';
import { logger } from '@log/providers';

export const getWhatsappNumbers = protectedEndpoint.query(
    queryMutationCallback(
        async ({
            ctx: {
                session: {
                    user: { organizationId },
                },
            },
            db,
        }) => {
            const { data: client, error: clientError } =
                await getTwilioClientOrg({ organizationId });

            if (clientError) return Success([]);

            const { data: incomingNumbers, error: listError } =
                await catchError(client.incomingPhoneNumbers.list());

            if (listError) {
                logger.error('Failed to list Twilio phone numbers', {
                    label: 'whatsapp',
                    organizationId,
                    error: String(listError),
                });
                return Success([]);
            }

            const { data: dbRecords, error: queryError } = await catchError(
                db
                    .select({
                        id: tables.brandWhatsappNumber.id,
                        phoneNumber: tables.brandWhatsappNumber.phoneNumber,
                        twilioSid: tables.brandWhatsappNumber.twilioSid,
                        metaPhoneNumberId:
                            tables.brandWhatsappNumber.metaPhoneNumberId,
                        senderStatus: tables.brandWhatsappNumber.senderStatus,
                        isDefault: tables.brandWhatsappNumber.isDefault,
                        brandId: tables.brand.id,
                        brandName: tables.brand.name,
                    })
                    .from(tables.brandWhatsappNumber)
                    .innerJoin(
                        tables.brand,
                        eq(tables.brandWhatsappNumber.brandId, tables.brand.id),
                    )
                    .where(eq(tables.brand.organizationId, organizationId)),
            );

            if (queryError) {
                logger.error('Failed to query WhatsApp DB records', {
                    label: 'whatsapp',
                    organizationId,
                    error: String(queryError),
                });
                return Success([]);
            }

            const dbMap = new Map(
                dbRecords.map((r) => [
                    r.phoneNumber,
                    {
                        id: r.id,
                        twilioSid: r.twilioSid,
                        metaPhoneNumberId: r.metaPhoneNumberId,
                        senderStatus: r.senderStatus,
                        isDefault: r.isDefault,
                        brandId: r.brandId,
                        brandName: r.brandName,
                    },
                ]),
            );

            const TWILIO_SANDBOX_NUMBER = '+14155238886';

            const result = incomingNumbers.map((number) => {
                const db = dbMap.get(number.phoneNumber);

                return {
                    phoneNumber: number.phoneNumber,
                    friendlyName: number.friendlyName,
                    id: db?.id ?? null,
                    twilioSid: db?.twilioSid ?? null,
                    metaPhoneNumberId: db?.metaPhoneNumberId ?? null,
                    senderStatus: db?.senderStatus ?? ('offline' as const),
                    isDefault: db?.isDefault ?? null,
                    brandId: db?.brandId ?? null,
                    brandName: db?.brandName ?? null,
                    isSandbox: false,
                };
            });

            if (!result.some((n) => n.phoneNumber === TWILIO_SANDBOX_NUMBER)) {
                const sandboxDb = dbMap.get(TWILIO_SANDBOX_NUMBER);

                result.push({
                    phoneNumber: TWILIO_SANDBOX_NUMBER,
                    friendlyName: 'WhatsApp Sandbox',
                    id: sandboxDb?.id ?? null,
                    twilioSid: sandboxDb?.twilioSid ?? null,
                    metaPhoneNumberId: sandboxDb?.metaPhoneNumberId ?? null,
                    senderStatus:
                        sandboxDb?.senderStatus ?? ('online' as const),
                    isDefault: sandboxDb?.isDefault ?? null,
                    brandId: sandboxDb?.brandId ?? null,
                    brandName: sandboxDb?.brandName ?? null,
                    isSandbox: true,
                });
            }

            // Add Meta-only numbers (not from Twilio)
            const resultPhoneNumbers = new Set(
                result.map((n) => n.phoneNumber),
            );

            for (const record of dbRecords) {
                if (
                    record.metaPhoneNumberId &&
                    !resultPhoneNumbers.has(record.phoneNumber)
                ) {
                    result.push({
                        phoneNumber: record.phoneNumber,
                        friendlyName: 'Meta WhatsApp',
                        id: record.id,
                        twilioSid: record.twilioSid,
                        metaPhoneNumberId: record.metaPhoneNumberId,
                        senderStatus: record.senderStatus,
                        isDefault: record.isDefault,
                        brandId: record.brandId,
                        brandName: record.brandName,
                        isSandbox: false,
                    });
                }
            }

            // Sync status for "creating" numbers
            const creatingNumbers = result.filter(
                (n) => n.senderStatus === 'creating' && n.id,
            );

            if (creatingNumbers.length > 0) {
                const { data: senders, error: sendersError } =
                    await getWhatsappSenders({ client });

                if (!sendersError) {
                    const registeredPhones = new Set(
                        senders.map((s) => s.phoneNumber),
                    );

                    for (const record of creatingNumbers) {
                        if (
                            !record.id ||
                            !registeredPhones.has(record.phoneNumber)
                        )
                            continue;

                        logger.info(
                            'Syncing WhatsApp sender status to online',
                            {
                                label: 'whatsapp',
                                phoneNumber: record.phoneNumber,
                                organizationId,
                            },
                        );

                        await catchError(
                            db
                                .update(tables.brandWhatsappNumber)
                                .set({ senderStatus: 'online' })
                                .where(
                                    eq(
                                        tables.brandWhatsappNumber.id,
                                        record.id,
                                    ),
                                ),
                        );

                        record.senderStatus = 'online';
                    }
                } else {
                    logger.warn(
                        'Failed to fetch Twilio senders for status sync',
                        {
                            label: 'whatsapp',
                            organizationId,
                        },
                    );
                }
            }

            logger.info('WhatsApp numbers retrieved', {
                label: 'whatsapp',
                count: result.length,
                organizationId,
            });

            return Success(result);
        },
    ),
);
