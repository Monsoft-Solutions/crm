import { z } from 'zod';

import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { extractConversationFacts as extractConversationFactsProvider } from '@mods/assistant/providers/server';

export const extractConversationFacts = protectedEndpoint
    .input(
        z.object({
            contactId: z.string(),
        }),
    )
    .mutation(
        queryMutationCallback(async ({ input: { contactId }, db }) => {
            const { data: conversationFacts, error: conversationFactsError } =
                await extractConversationFactsProvider({
                    db,
                    contactId,
                });

            if (conversationFactsError) return Error(conversationFactsError);

            return Success(conversationFacts);
        }),
    );
