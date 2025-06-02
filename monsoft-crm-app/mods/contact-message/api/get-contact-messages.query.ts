import { z } from 'zod';

import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { getContactMessages as getContactMessagesProvider } from '../providers/server';

export const getContactMessages = protectedEndpoint
    .input(z.object({ contactId: z.string() }))
    .query(
        queryMutationCallback(async ({ input: { contactId } }) => {
            const { data: contactMessages, error: contactMessagesError } =
                await getContactMessagesProvider({
                    contactId,
                });

            if (contactMessagesError) return Error();

            return Success(contactMessages);
        }),
    );
