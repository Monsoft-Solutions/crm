import { v4 as uuidv4 } from 'uuid';

import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import tables from '@db/db';

export const addContactPhoneNumber = protectedEndpoint
    .input(z.object({ contactId: z.string(), phoneNumber: z.string() }))
    .mutation(
        queryMutationCallback(
            async ({ input: { contactId, phoneNumber }, db }) => {
                const { data: contact, error: contactError } = await catchError(
                    db.query.contact.findFirst({
                        where: (record, { eq }) => eq(record.id, contactId),
                    }),
                );

                if (contactError) return Error();

                if (!contact) return Error();

                const {
                    data: contactPhoneNumbers,
                    error: contactPhoneNumbersError,
                } = await catchError(
                    db.query.contactPhoneNumber.findMany({
                        where: (record, { eq }) =>
                            eq(record.contactId, contactId),

                        with: {
                            contact: true,
                        },
                    }),
                );

                if (contactPhoneNumbersError) return Error();

                for (const contactPhoneNumber of contactPhoneNumbers) {
                    if (contactPhoneNumber.contact.brandId === contact.brandId)
                        return Error(
                            'CONTACT_PHONE_NUMBER_ALREADY_EXISTS_FOR_BRAND',
                        );
                }

                const { error: insertContactPhoneNumberError } =
                    await catchError(
                        db.insert(tables.contactPhoneNumber).values({
                            id: uuidv4(),
                            contactId,
                            phoneNumber,
                        }),
                    );

                if (insertContactPhoneNumberError) return Error();

                return Success();
            },
        ),
    );
