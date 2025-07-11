import { asc, and, InferSelectModel } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { contactEmail } from '@db/db';

export const getContactEmailMessages = (async ({ db, contactId, from, to }) => {
    const { data: contactEmails, error: contactEmailsError } = await catchError(
        db.query.contactEmail.findMany({
            where: (record, { eq, gte, lt }) =>
                and(
                    eq(record.contactId, contactId),
                    from ? gte(record.createdAt, from) : undefined,
                    to ? lt(record.createdAt, to) : undefined,
                ),

            orderBy: asc(contactEmail.createdAt),
        }),
    );

    if (contactEmailsError) return Error();

    return Success(contactEmails);
}) satisfies Function<
    { contactId: string; db: Tx; from?: number; to?: number },
    InferSelectModel<typeof contactEmail>[]
>;
