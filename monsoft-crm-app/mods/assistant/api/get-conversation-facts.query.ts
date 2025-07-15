import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const getConversationFacts = protectedEndpoint
    .input(
        z.object({
            contactId: z.string(),
        }),
    )
    .query(
        queryMutationCallback(async ({ input: { contactId }, db }) => {
            const { data: conversationFacts, error: conversationFactsError } =
                await catchError(
                    db.query.conversationFacts.findFirst({
                        where: (record, { eq }) =>
                            eq(record.contactId, contactId),

                        with: {
                            topicsDiscussed: true,
                        },
                    }),
                );

            if (conversationFactsError) return Error(conversationFactsError);

            if (!conversationFacts) return Success(undefined);

            return Success(conversationFacts);
        }),
    );
