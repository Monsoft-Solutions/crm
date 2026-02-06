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
        queryMutationCallback(
            async ({
                db,
                input: {
                    id,
                    communicationStyle,
                    responseTone,
                    detailLevel,
                    ...assistantUpdates
                },
            }) => {
                const { data: existingAssistant, error: queryError } =
                    await catchError(
                        db.query.assistant.findFirst({
                            where: (record, { eq }) => eq(record.id, id),
                            columns: { behaviorId: true },
                        }),
                    );

                if (queryError) return Error('UPDATE_ASSISTANT_ERROR');

                if (!existingAssistant) return Error('ASSISTANT_NOT_FOUND');

                const behaviorUpdates = {
                    ...(communicationStyle !== undefined && {
                        communicationStyle,
                    }),
                    ...(responseTone !== undefined && { responseTone }),
                    ...(detailLevel !== undefined && { detailLevel }),
                };

                if (Object.keys(behaviorUpdates).length > 0) {
                    const { error: behaviorError } = await catchError(
                        db
                            .update(tables.assistantBehavior)
                            .set(behaviorUpdates)
                            .where(
                                eq(
                                    tables.assistantBehavior.id,
                                    existingAssistant.behaviorId,
                                ),
                            ),
                    );

                    if (behaviorError)
                        return Error('UPDATE_ASSISTANT_BEHAVIOR_ERROR');
                }

                if (Object.keys(assistantUpdates).length > 0) {
                    const { error: updateError } = await catchError(
                        db
                            .update(tables.assistant)
                            .set(assistantUpdates)
                            .where(eq(tables.assistant.id, id)),
                    );

                    if (updateError) return Error('UPDATE_ASSISTANT_ERROR');
                }

                return Success();
            },
        ),
    );
