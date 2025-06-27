import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { db } from '@db/providers/server';

export const getContactPhoneNumbers = protectedEndpoint
    .input(z.object({ contactId: z.string() }))
    .query(
        queryMutationCallback(async ({ input: { contactId } }) => {
            const { error, data: contactPhoneNumbers } = await catchError(
                db.query.contactPhoneNumber.findMany({
                    where: (record, { eq }) => eq(record.contactId, contactId),
                    orderBy: (record, { asc }) => asc(record.id),
                }),
            );

            if (error) return Error();

            return Success(contactPhoneNumbers);
        }),
    );
