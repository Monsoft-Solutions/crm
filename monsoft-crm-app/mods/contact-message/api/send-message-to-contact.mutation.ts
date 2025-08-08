import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { sendMessageToContactSchema } from '../schemas';

import { sendMessageToContact as sendMessageToContactProvider } from '../providers/server';

export const sendMessageToContact = protectedEndpoint
    .input(sendMessageToContactSchema)
    .mutation(
        queryMutationCallback(
            async ({ input: { contactId, channelType, body }, db }) => {
                const { error } = await sendMessageToContactProvider({
                    db,
                    contactId,
                    channelType,
                    body,
                });

                if (error) return Error();

                return Success();
            },
        ),
    );
