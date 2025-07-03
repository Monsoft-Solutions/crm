import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const getContact = protectedEndpoint
    .input(z.object({ id: z.string() }))
    .query(
        queryMutationCallback(async ({ input: { id }, db }) => {
            const { error, data: contact } = await catchError(
                db.query.contact.findFirst({
                    where: (record, { eq }) => eq(record.id, id),
                }),
            );

            if (error) return Error();

            if (contact === undefined) return Error('CONTACT_NOT_FOUND');

            return Success(contact);
        }),
    );
