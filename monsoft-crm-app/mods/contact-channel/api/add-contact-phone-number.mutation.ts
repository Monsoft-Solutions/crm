import { v4 as uuidv4 } from 'uuid';

import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { db } from '@db/providers/server';
import tables from '@db/db';

export const addContactPhoneNumber = protectedEndpoint
    .input(z.object({ contactId: z.string(), phoneNumber: z.string() }))
    .mutation(
        queryMutationCallback(async ({ input: { contactId, phoneNumber } }) => {
            const { error } = await catchError(
                db.transaction(async (tx) => {
                    await tx.insert(tables.contactPhoneNumber).values({
                        id: uuidv4(),
                        contactId,
                        phoneNumber,
                    });
                }),
            );

            if (error) return Error();

            return Success();
        }),
    );
