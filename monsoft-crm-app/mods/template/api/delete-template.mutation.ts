import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { z } from 'zod';

import { ensurePermission } from '@guard/providers';

import { db } from '@db/providers/server';

import { emit } from '@events/providers';

import { templateTable } from '../db';

import { eq } from 'drizzle-orm';
import { catchError } from '@errors/utils/catch-error.util';

import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

// mutation to delete a template
export const deleteTemplate = protectedEndpoint
    .input(z.object({ id: z.string() }))
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: { user },
                },

                input: { id },
            }) => {
                const { data: template, error: readError } = await catchError(
                    db.query.templateTable.findFirst({
                        where: eq(templateTable.id, id),
                    }),
                );

                // if some error occurred while fetching the template
                if (readError) return Error('READ_ERROR');

                // if template does not exist
                if (!template) return Error('NOT_FOUND');

                // check if user has permission to delete the given template
                ensurePermission({
                    user,
                    resource: 'template',
                    action: 'delete',
                    instance: template,
                });

                // delete the template
                const { error: deleteError } = await catchError(
                    db.delete(templateTable).where(eq(templateTable.id, id)),
                );

                // if some error occurred while deleting the template
                if (deleteError) return Error('DELETE_ERROR');

                emit({ event: 'templateDeleted', payload: { id } });

                return Success();
            },
        ),
    );
