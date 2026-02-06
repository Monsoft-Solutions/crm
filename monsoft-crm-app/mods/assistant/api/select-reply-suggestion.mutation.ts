import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { eq } from 'drizzle-orm';

import tables from '@db/db';

import { selectReplySuggestionSchema } from '../schemas';

export const selectReplySuggestion = protectedEndpoint
    .input(selectReplySuggestionSchema)
    .mutation(
        queryMutationCallback(async ({ db, input: { id } }) => {
            const { error: updateError } = await catchError(
                db
                    .update(tables.replySuggestion)
                    .set({ selectedAt: Date.now() })
                    .where(eq(tables.replySuggestion.id, id)),
            );

            if (updateError) return Error('SELECT_REPLY_SUGGESTION_ERROR');

            return Success();
        }),
    );
