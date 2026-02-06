import { Success, Error } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import {
    getTwilioClientOrg,
    registerWhatsappSender as registerWhatsappSenderProvider,
} from '@twilio/providers';

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
                input: { phoneNumberSid },
            }) => {
                logger.info('Register WhatsApp sender requested', {
                    label: 'whatsapp',
                    phoneNumberSid,
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

                const { data: sender, error: senderError } =
                    await registerWhatsappSenderProvider({
                        client,
                        phoneNumber: phoneNumberSid,
                    });

                if (senderError) {
                    logger.error('WhatsApp sender registration failed', {
                        label: 'whatsapp',
                        phoneNumberSid,
                        organizationId,
                    });
                    return Error('REGISTER_FAILED');
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
