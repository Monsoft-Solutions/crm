import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const getReplySuggestions = protectedEndpoint
    .input(
        z.object({
            messageId: z.string(),
        }),
    )
    .query(
        queryMutationCallback(async ({ input: { messageId }, db }) => {
            const { data: suggestions, error: suggestionsError } =
                await catchError(
                    db.query.replySuggestion.findMany({
                        where: (record, { eq }) =>
                            eq(record.messageId, messageId),
                    }),
                );

            if (suggestionsError) return Error(suggestionsError);

            const response = suggestions.map(
                ({ id, content, certaintyLevel }) => ({
                    id,
                    content,
                    certaintyLevel,
                }),
            );

            return Success(response);
        }),
    );
