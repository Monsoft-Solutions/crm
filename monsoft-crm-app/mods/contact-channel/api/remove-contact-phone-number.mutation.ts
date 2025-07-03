import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { eq } from 'drizzle-orm';
import tables from '@db/db';

export const removeContactPhoneNumber = protectedEndpoint
    .input(z.object({ phoneNumberId: z.string() }))
    .mutation(
        queryMutationCallback(async ({ input: { phoneNumberId }, db }) => {
            const { error: deleteContactPhoneNumberError } = await catchError(
                db
                    .delete(tables.contactPhoneNumber)
                    .where(eq(tables.contactPhoneNumber.id, phoneNumberId)),
            );

            if (deleteContactPhoneNumberError) return Error();

            return Success();
        }),
    );
