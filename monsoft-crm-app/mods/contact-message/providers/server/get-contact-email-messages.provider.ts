import { InferSelectModel } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { contactEmail } from '@db/db';

export const getContactEmailMessages = (async ({ contactId }) => {
    const { data: contactEmailAddresses, error: contactEmailAddressesError } =
        await catchError(
            db.query.contactEmailAddress.findMany({
                where: (record, { eq }) => eq(record.contactId, contactId),

                with: {
                    contactEmails: true,
                },
            }),
        );

    if (contactEmailAddressesError) return Error();

    const emailMessages = contactEmailAddresses.flatMap(
        (emailAddress) => emailAddress.contactEmails,
    );

    return Success(emailMessages);
}) satisfies Function<
    { contactId: string },
    InferSelectModel<typeof contactEmail>[]
>;
