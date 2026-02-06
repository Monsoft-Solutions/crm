import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const getAssistant = protectedEndpoint
    .input(z.object({ id: z.string() }))
    .query(
        queryMutationCallback(async ({ input: { id }, db }) => {
            const { data: assistant, error: assistantError } = await catchError(
                db.query.assistant.findFirst({
                    where: (record, { eq }) => eq(record.id, id),

                    columns: {
                        id: true,
                        name: true,
                        description: true,
                        type: true,
                        model: true,
                        tone: true,
                        instructions: true,
                        expertise: true,
                        responseMode: true,
                    },

                    with: {
                        behavior: true,
                    },
                }),
            );

            if (assistantError) return Error('ASSISTANT_QUERY_ERROR');

            if (!assistant) return Error('ASSISTANT_NOT_FOUND');

            const { behavior, ...rest } = assistant;

            const flattenedAssistant = {
                ...rest,
                ...behavior,
            };

            return Success(flattenedAssistant);
        }),
    );
