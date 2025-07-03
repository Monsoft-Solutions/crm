import { InferSelectModel } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { contactEmail } from '@db/db';

export const getContactEmailMessages = (async ({ contactId, db }) => {
    const { data: contactEmails, error: contactEmailsError } = await catchError(
        db.query.contactEmail.findMany({
            where: (record, { eq }) => eq(record.contactId, contactId),
        }),
    );

    if (contactEmailsError) return Error();

    return Success(contactEmails);
}) satisfies Function<
    { contactId: string; db: Tx },
    InferSelectModel<typeof contactEmail>[]
>;
