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
                const {
                    data: contactPhoneNumbers,
                    error: contactPhoneNumbersError,
                } = await catchError(
                    db.query.contactPhoneNumber.findMany({
                        where: (record, { eq }) =>
                            eq(record.phoneNumber, phoneNumber),

                        with: {
                            contact: true,
                        },
                    }),
                );

                if (contactPhoneNumbersError) return Error();

                for (const contactPhoneNumber of contactPhoneNumbers) {
                    if (contactPhoneNumber.contact.brandId === brandId)
                        return Error(
                            'CONTACT_PHONE_NUMBER_ALREADY_EXISTS_FOR_BRAND',
                        );
                }

                const {
                    data: contactEmailAddresses,
                    error: contactEmailAddressesError,
                } = await catchError(
                    db.query.contactEmailAddress.findMany({
                        where: (record, { eq }) =>
                            eq(record.emailAddress, emailAddress),

                        with: {
                            contact: true,
                        },
                    }),
                );

                if (contactEmailAddressesError) return Error();

                for (const contactEmailAddress of contactEmailAddresses) {
                    if (contactEmailAddress.contact.brandId === brandId)
                        return Error(
                            'CONTACT_EMAIL_ADDRESS_ALREADY_EXISTS_FOR_BRAND',
                        );
                }

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
