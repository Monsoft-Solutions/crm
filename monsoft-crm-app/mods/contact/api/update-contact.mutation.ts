import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { eq } from 'drizzle-orm';

import tables from '@db/db';

import { updateContactSchema } from '../schemas';

export const updateContact = protectedEndpoint
    .input(updateContactSchema.extend({ id: z.string() }))
    .mutation(
        queryMutationCallback(
            async ({ input: { id, firstName, lastName }, db }) => {
                const contact = { id, firstName, lastName };

                const { error: updateContactError } = await catchError(
                    db
                        .update(tables.contact)
                        .set(contact)
                        .where(eq(tables.contact.id, id)),
                );

                if (updateContactError) return Error();

                return Success();
            },
        ),
    );
