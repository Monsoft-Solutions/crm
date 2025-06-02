import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { sendMessageToContactSchema } from '../schemas';
import { sendSmsToContact as sendSmsToContactProvider } from '../providers/server';

export const sendMessageToContact = protectedEndpoint
    .input(sendMessageToContactSchema)
    .mutation(
        queryMutationCallback(
            async ({ input: { contactId, channelType, body } }) => {
                if (channelType === 'sms') {
                    const { error } = await sendSmsToContactProvider({
                        contactId,
                        body,
                    });

                    if (error) return Error();
                    return Success();
                }

                return Error('INVALID_CHANNEL_TYPE');
            },
        ),
    );
