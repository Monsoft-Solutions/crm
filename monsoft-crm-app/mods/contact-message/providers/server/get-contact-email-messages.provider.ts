import { asc, and, InferSelectModel } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { contactMessage } from '@db/db';

export const getContactEmailMessages = (async ({ db, contactId, from, to }) => {
    const { data: emails, error: emailsError } = await catchError(
        db.query.contactMessage.findMany({
            where: (record, { eq, gte, lt }) =>
                and(
                    eq(record.contactId, contactId),
                    eq(record.channel, 'email'),
                    from ? gte(record.createdAt, from) : undefined,
                    to ? lt(record.createdAt, to) : undefined,
                ),

            orderBy: asc(contactMessage.createdAt),
        }),
    );

    if (emailsError) return Error();

    return Success(emails);
}) satisfies Function<
    { contactId: string; db: Tx; from?: number; to?: number },
    InferSelectModel<typeof contactMessage>[]
>;
