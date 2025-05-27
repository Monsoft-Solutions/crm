import { v4 as uuidv4 } from 'uuid';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { db } from '@db/providers/server';
import tables from '@db/db';

import { sendEmailToContactSchema } from '../schemas';

export const sendEmailToContact = protectedEndpoint
    .input(sendEmailToContactSchema)
    .mutation(
        queryMutationCallback(
            async ({ input: { contactEmailAddressId, body } }) => {
                const id = uuidv4();

                const contactEmailAddress = {
                    id,
                    contactEmailAddressId,
                    body,
                };

                const { error } = await catchError(
                    db.insert(tables.contactEmail).values(contactEmailAddress),
                );

                if (error) return Error();

                return Success();
            },
        ),
    );
