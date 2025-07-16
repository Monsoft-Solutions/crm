import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { ConversationFactsSchema } from '../schemas';

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

                        orderBy: (record, { desc }) => desc(record.createdAt),
                    }),
                );

            if (conversationFactsError) return Error(conversationFactsError);

            if (!conversationFacts) return Success(undefined);

            const parsingFacts = ConversationFactsSchema.safeParse(
                conversationFacts.facts,
            );

            if (!parsingFacts.success)
                return Error('INVALID_CONVERSATION_FACTS');

            const parsedFacts = parsingFacts.data;

            return Success(parsedFacts);
        }),
    );
