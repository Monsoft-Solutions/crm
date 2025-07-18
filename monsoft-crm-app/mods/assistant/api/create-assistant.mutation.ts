import { v4 as uuidv4 } from 'uuid';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import tables from '@db/db';

import { createAssistantSchema } from '../schemas';

export const createAssistant = protectedEndpoint
    .input(createAssistantSchema)
    .mutation(
        queryMutationCallback(
            async ({
                db,
                input: { brandId, name, model, tone, instructions },
            }) => {
                const { data: createdAssistant, error: createError } =
                    await catchError(
                        db
                            .insert(tables.assistant)
                            .values({
                                id: uuidv4(),
                                brandId,
                                name,
                                model,
                                tone,
                                instructions,
                            })
                            .returning(),
                    );

                if (createError) return Error('CREATE_ASSISTANT_ERROR');

                if (createdAssistant.length === 0)
                    return Error('ASSISTANT_NOT_FOUND');

                return Success();
            },
        ),
    );
