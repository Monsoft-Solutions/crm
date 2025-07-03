import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { z } from 'zod';

import { ensurePermission } from '@guard/providers';

import { emit } from '@events/providers';

import { templateTable } from '../db';

import { eq } from 'drizzle-orm';

import { templateStatusEnum } from '../enums';

import { catchError } from '@errors/utils/catch-error.util';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

// mutation to update the status of a template
export const updateTemplateStatus = protectedEndpoint
    .input(z.object({ id: z.string(), status: templateStatusEnum }))
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: { user },
                },
                input: { id, status },
                db,
            }) => {
                // get the template
                const { data: template, error: readError } = await catchError(
                    db.query.templateTable.findFirst({
                        where: (record) => eq(record.id, id),
                    }),
                );

                // if some error occurred while getting the template
                if (readError) return Error();
                // otherise...

                // if the template is not found, return
                if (template === undefined) return Error('NOT_FOUND');
                // otherise...

                // ensure user has permission to update the template status
                ensurePermission({
                    user,
                    resource: 'template',
                    action: 'update_status',
                    instance: template,
                });

                // update the template status
                const { error: updateError } = await catchError(
                    db
                        .update(templateTable)
                        .set({ status })
                        .where(eq(templateTable.id, id)),
                );

                // if some error occurred while updating the template status
                if (updateError) return Error();

                // emit a template-status-updated event
                emit({
                    event: 'templateStatusUpdated',
                    payload: { id, status },
                });

                // return no error
                return Success();
            },
        ),
    );
