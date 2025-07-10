import { and, asc, InferSelectModel } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { contactSmsMessage } from '@db/db';

export const getContactSmsMessages = (async ({ db, contactId, from }) => {
    const { data: smsMessages, error: smsMessagesError } = await catchError(
        db.query.contactSmsMessage.findMany({
            where: (record, { eq, gte }) =>
                and(
                    eq(record.contactId, contactId),
                    from ? gte(record.createdAt, from) : undefined,
                ),

            orderBy: asc(contactSmsMessage.createdAt),
        }),
    );

    if (smsMessagesError) return Error();

    return Success(smsMessages);
}) satisfies Function<
    { contactId: string; db: Tx; from?: number },
    InferSelectModel<typeof contactSmsMessage>[]
>;
