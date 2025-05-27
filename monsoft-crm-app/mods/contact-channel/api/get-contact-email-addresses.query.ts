import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { db } from '@db/providers/server';

export const getContactEmailAddresses = protectedEndpoint
    .input(z.object({ contactId: z.string() }))
    .query(
        queryMutationCallback(async ({ input: { contactId } }) => {
            const { error, data: contactEmailAddresses } = await catchError(
                db.query.contactEmailAddress.findMany({
                    where: (record, { eq }) => eq(record.contactId, contactId),
                }),
            );

            if (error) return Error();

            return Success(contactEmailAddresses);
        }),
    );
