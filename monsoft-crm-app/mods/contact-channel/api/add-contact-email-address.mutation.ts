import { v4 as uuidv4 } from 'uuid';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { db } from '@db/providers/server';
import tables from '@db/db';

import { addContactEmailAddressSchema } from '../schemas/add-contact-email-address.schema';

export const addContactEmailAddress = protectedEndpoint
    .input(addContactEmailAddressSchema)
    .mutation(
        queryMutationCallback(
            async ({ input: { contactId, emailAddress } }) => {
                const id = uuidv4();

                const contactEmailAddress = {
                    id,
                    contactId,
                    emailAddress,
                };

                const { error } = await catchError(
                    db
                        .insert(tables.contactEmailAddress)
                        .values(contactEmailAddress),
                );

                if (error) return Error();

                return Success();
            },
        ),
    );
