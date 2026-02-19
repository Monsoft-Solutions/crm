import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { eq } from 'drizzle-orm';
import tables from '@db/db';

export const removeContactEmailAddress = protectedEndpoint
    .input(z.object({ emailAddressId: z.string() }))
    .mutation(
        queryMutationCallback(async ({ input: { emailAddressId }, db }) => {
            const { error } = await catchError(
                db
                    .delete(tables.contactEmailAddress)
                    .where(eq(tables.contactEmailAddress.id, emailAddressId)),
            );

            if (error) return Error();

            return Success();
        }),
    );
