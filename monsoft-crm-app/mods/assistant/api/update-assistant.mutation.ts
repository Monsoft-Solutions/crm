import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { eq } from 'drizzle-orm';

import tables from '@db/db';

import { updateAssistantSchema } from '../schemas';

export const updateAssistant = protectedEndpoint
    .input(updateAssistantSchema)
    .mutation(
        queryMutationCallback(async ({ db, input: { id, ...updates } }) => {
            const { data: updatedAssistant, error: updateError } =
                await catchError(
                    db
                        .update(tables.assistant)
                        .set(updates)
                        .where(eq(tables.assistant.id, id))
                        .returning(),
                );

            if (updateError) return Error('UPDATE_ASSISTANT_ERROR');

            if (updatedAssistant.length === 0)
                return Error('ASSISTANT_NOT_FOUND');

            return Success();
        }),
    );
