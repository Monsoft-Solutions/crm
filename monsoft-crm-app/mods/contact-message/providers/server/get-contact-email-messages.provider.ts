import { InferSelectModel } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { contactEmail } from '@db/db';

export const getContactEmailMessages = (async ({ contactId }) => {
    const { data: contactEmails, error: contactEmailsError } = await catchError(
        db.query.contactEmail.findMany({
            where: (record, { eq }) => eq(record.contactId, contactId),
        }),
    );

    if (contactEmailsError) return Error();

    return Success(contactEmails);
}) satisfies Function<
    { contactId: string },
    InferSelectModel<typeof contactEmail>[]
>;
