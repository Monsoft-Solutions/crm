import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

import { Success, Error } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import tables from '@db/db';
import { logger } from '@log/providers';

import { addMetaWhatsappNumberSchema } from '../schemas';

export const addMetaWhatsappNumber = protectedEndpoint
    .input(addMetaWhatsappNumberSchema)
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: {
                        user: { organizationId },
                    },
                },
                input: { phoneNumber, metaPhoneNumberId, brandId },
                db,
            }) => {
                logger.info('Add Meta WhatsApp number requested', {
                    label: 'whatsapp',
                    phoneNumber,
                    metaPhoneNumberId,
                    brandId,
                    organizationId,
                });

                // Verify brand belongs to the user's organization
                const { data: brand, error: brandError } = await catchError(
                    db.query.brand.findFirst({
                        where: (record, { eq: e, and: a }) =>
                            a(
                                e(record.id, brandId),
                                e(record.organizationId, organizationId),
                            ),
                    }),
                );

                if (brandError || !brand) {
                    logger.error('Brand not found or access denied', {
                        label: 'whatsapp',
                        brandId,
                        organizationId,
                    });
                    return Error('BRAND_NOT_FOUND');
                }

                // Check if brand already has WhatsApp numbers to determine default
                const { data: existingNumbers, error: countError } =
                    await catchError(
                        db
                            .select({ id: tables.brandWhatsappNumber.id })
                            .from(tables.brandWhatsappNumber)
                            .where(
                                eq(tables.brandWhatsappNumber.brandId, brandId),
                            ),
                    );

                if (countError) {
                    logger.error('Failed to count existing numbers', {
                        label: 'whatsapp',
                        brandId,
                    });
                    return Error('COUNT_FAILED');
                }

                const isDefault =
                    existingNumbers.length === 0 ? ('true' as const) : null;

                // Insert new Meta WhatsApp number
                const { error: insertError } = await catchError(
                    db.insert(tables.brandWhatsappNumber).values({
                        id: uuidv4(),
                        brandId,
                        phoneNumber,
                        metaPhoneNumberId,
                        senderStatus: 'online',
                        isDefault,
                    }),
                );

                if (insertError) {
                    logger.error('Failed to insert Meta WhatsApp number', {
                        label: 'whatsapp',
                        phoneNumber,
                        metaPhoneNumberId,
                        brandId,
                        error: String(insertError),
                    });
                    return Error('INSERT_FAILED');
                }

                logger.info('Meta WhatsApp number added', {
                    label: 'whatsapp',
                    phoneNumber,
                    metaPhoneNumberId,
                    brandId,
                    isDefault,
                });

                return Success();
            },
        ),
    );
