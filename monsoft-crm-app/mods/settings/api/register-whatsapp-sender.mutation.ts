import { Success, Error } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import {
    getTwilioClientOrg,
    registerWhatsappSender as registerWhatsappSenderProvider,
} from '@twilio/providers';

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
                const { data: client, error: clientError } =
                    await getTwilioClientOrg({
                        organizationId,
                    });

                if (clientError) return Error('TWILIO_CLIENT_ERROR');

                const { data: sender, error: senderError } =
                    await registerWhatsappSenderProvider({
                        client,
                        phoneNumber: phoneNumberSid,
                    });

                if (senderError) return Error('REGISTER_FAILED');

                return Success(sender);
            },
        ),
    );
