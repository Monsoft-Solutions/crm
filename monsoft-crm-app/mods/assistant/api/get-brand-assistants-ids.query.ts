import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const getBrandAssistantsIds = protectedEndpoint
    .input(z.object({ brandId: z.string() }))
    .query(
        queryMutationCallback(async ({ input: { brandId }, db }) => {
            const { data: assistants, error: assistantsError } =
                await catchError(
                    db.query.assistant.findMany({
                        where: (record, { eq }) => eq(record.brandId, brandId),

                        columns: {
                            id: true,
                        },
                    }),
                );

            if (assistantsError) return Error('ASSISTANTS_QUERY_ERROR');

            return Success(assistants);
        }),
    );
