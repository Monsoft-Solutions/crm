import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { db } from '@db/providers/server';
import { eq } from 'drizzle-orm';

import tables from '@db/db';

import { updateContactSchema } from '../schemas';

export const updateContact = protectedEndpoint
    .input(updateContactSchema.extend({ id: z.string() }))
    .mutation(
        queryMutationCallback(
            async ({ input: { id, firstName, lastName } }) => {
                const contact = { id, firstName, lastName };

                const { error } = await catchError(
                    db.transaction(async (tx) => {
                        await tx
                            .update(tables.contact)
                            .set(contact)
                            .where(eq(tables.contact.id, id));
                    }),
                );

                if (error) return Error();

                return Success();
            },
        ),
    );
