import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { z } from 'zod';

import { ensurePermission } from '@guard/providers';

import { db } from '@db/providers/server';

import { catchError } from '@errors/utils/catch-error.util';

import { v4 as uuidv4 } from 'uuid';

import { emit } from '@events/providers';

import { templateTable } from '../db';
import type { TemplateStatus } from '../enums';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

// mutation to create a template
export const createTemplate = protectedEndpoint
    .input(z.object({ name: z.string() }))
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: { user },
                },
                input: { name },
            }) => {
                // ensure user has permission to create a template
                ensurePermission({
                    user,
                    resource: 'template',
                    action: 'create',
                });

                // generate a unique id for the template
                const id = uuidv4();

                // set the current user as the creator of the template
                const creator = user.id;

                // set the initial template status to draft
                const status: TemplateStatus = 'draft';

                // create the template object
                const template = { id, name, creator, status };

                // insert the template into db
                const { error } = await catchError(
                    db.insert(templateTable).values(template),
                );

                // if insertion failed, return the error
                if (error) {
                    if (error === 'DUPLICATE_ENTRY') return Error('DUPLICATE');

                    return Error();
                }
                // otherwise...

                // emit a template-created event
                emit({ event: 'templateCreated', payload: template });

                return Success();
            },
        ),
    );
