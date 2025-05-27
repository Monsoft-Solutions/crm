import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { db } from '@db/providers/server';

export const getContactEmails = protectedEndpoint
    .input(z.object({ contactId: z.string() }))
    .query(
        queryMutationCallback(async ({ input: { contactId } }) => {
            const { error, data: contactEmails } = await catchError(
                db.query.contactEmailAddress.findMany({
                    where: (record, { eq }) => eq(record.contactId, contactId),

                    with: {
                        contactEmails: true,
                    },
                }),
            );

            if (error) return Error();

            const emails = contactEmails.flatMap(
                (email) => email.contactEmails,
            );

            return Success(emails);
        }),
    );
