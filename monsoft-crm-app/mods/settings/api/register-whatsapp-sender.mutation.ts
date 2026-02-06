import { eq } from 'drizzle-orm';

import { Success, Error } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import {
    getTwilioClientOrg,
    registerWhatsappSender as registerWhatsappSenderProvider,
} from '@twilio/providers';

import tables from '@db/db';
import { logger } from '@log/providers';

import { registerWhatsappSenderSchema } from '../schemas';

export const registerWhatsappSender = protectedEndpoint
    .input(registerWhatsappSenderSchema)
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: {
                        user: { organizationId },
                    },
                },
                input: { phoneNumber },
                db,
            }) => {
                logger.info('Register WhatsApp sender requested', {
                    label: 'whatsapp',
                    phoneNumber,
                    organizationId,
                });

                const { data: client, error: clientError } =
                    await getTwilioClientOrg({
                        organizationId,
                    });

                if (clientError) {
                    logger.error('Failed to get Twilio client', {
                        label: 'whatsapp',
                        organizationId,
                    });
                    return Error('TWILIO_CLIENT_ERROR');
                }

                logger.info('Looking up Twilio phone number SID', {
                    label: 'whatsapp',
                    phoneNumber,
                });

                const { data: incomingNumbers, error: lookupError } =
                    await catchError(
                        client.incomingPhoneNumbers.list({ phoneNumber }),
                    );

                if (lookupError || !incomingNumbers.length) {
                    logger.error('Failed to look up Twilio phone number SID', {
                        label: 'whatsapp',
                        phoneNumber,
                        error: lookupError
                            ? String(lookupError)
                            : 'No matching number found',
                    });
                    return Error('PHONE_NUMBER_LOOKUP_FAILED');
                }

                const twilioPhoneNumberSid = incomingNumbers[0].sid;

                logger.info('Found Twilio phone number SID', {
                    label: 'whatsapp',
                    phoneNumber,
                    twilioPhoneNumberSid,
                });

                const { data: sender, error: senderError } =
                    await registerWhatsappSenderProvider({
                        client,
                        phoneNumber: twilioPhoneNumberSid,
                    });

                if (senderError) {
                    logger.error('WhatsApp sender registration failed', {
                        label: 'whatsapp',
                        phoneNumber,
                        organizationId,
                    });
                    return Error('REGISTER_FAILED');
                }

                logger.info('WhatsApp sender registered, updating DB', {
                    label: 'whatsapp',
                    senderSid: sender.senderSid,
                    phoneNumber,
                    organizationId,
                });

                const { error: updateError } = await catchError(
                    db
                        .update(tables.brandWhatsappNumber)
                        .set({
                            twilioSid: sender.senderSid,
                            senderStatus: 'creating',
                        })
                        .where(
                            eq(
                                tables.brandWhatsappNumber.phoneNumber,
                                phoneNumber,
                            ),
                        ),
                );

                if (updateError) {
                    logger.error('Failed to update DB after registration', {
                        label: 'whatsapp',
                        phoneNumber,
                        senderSid: sender.senderSid,
                        error: String(updateError),
                    });
                    return Error('DB_UPDATE_FAILED');
                }

                logger.info('WhatsApp sender registered successfully', {
                    label: 'whatsapp',
                    senderSid: sender.senderSid,
                    organizationId,
                });

                return Success(sender);
            },
        ),
    );
