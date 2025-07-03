import { v4 as uuidv4 } from 'uuid';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import tables from '@db/db';

import { createContactSchema } from '../schemas';

export const createContact = protectedEndpoint
    .input(createContactSchema)
    .mutation(
        queryMutationCallback(
            async ({
                input: {
                    brandId,
                    firstName,
                    lastName,
                    phoneNumber,
                    emailAddress,
                },
                db,
            }) => {
                const contactId = uuidv4();

                const contact = { id: contactId, brandId, firstName, lastName };

                const { error: insertContactError } = await catchError(
                    db.insert(tables.contact).values(contact),
                );

                if (insertContactError) return Error();

                const { error: insertContactPhoneNumberError } =
                    await catchError(
                        db.insert(tables.contactPhoneNumber).values({
                            id: uuidv4(),
                            contactId,
                            phoneNumber,
                            isDefault: 'true',
                        }),
                    );

                if (insertContactPhoneNumberError) return Error();

                const { error: insertContactEmailAddressError } =
                    await catchError(
                        db.insert(tables.contactEmailAddress).values({
                            id: uuidv4(),
                            contactId,
                            emailAddress,
                        }),
                    );

                if (insertContactEmailAddressError) return Error();

                return Success();
            },
        ),
    );
