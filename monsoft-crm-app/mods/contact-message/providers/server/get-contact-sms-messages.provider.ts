import { InferSelectModel } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { contactSmsMessage } from '@db/db';

export const getContactSmsMessages = (async ({ contactId }) => {
    const { data: smsMessages, error: smsMessagesError } = await catchError(
        db.query.contactSmsMessage.findMany({
            where: (record, { eq }) => eq(record.contactId, contactId),
        }),
    );

    if (smsMessagesError) return Error();

    return Success(smsMessages);
}) satisfies Function<
    { contactId: string },
    InferSelectModel<typeof contactSmsMessage>[]
>;
