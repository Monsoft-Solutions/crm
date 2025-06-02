import { InferSelectModel } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { contactSmsMessage } from '@db/db';

export const getContactSmsMessages = (async ({ contactId }) => {
    const { data: contactPhoneNumbers, error: contactPhoneNumbersError } =
        await catchError(
            db.query.contactPhoneNumber.findMany({
                where: (record, { eq }) => eq(record.contactId, contactId),

                with: {
                    contactSmsMessages: true,
                },
            }),
        );

    if (contactPhoneNumbersError) return Error();

    const smsMessages = contactPhoneNumbers.flatMap(
        (phoneNumber) => phoneNumber.contactSmsMessages,
    );

    return Success(smsMessages);
}) satisfies Function<
    { contactId: string },
    InferSelectModel<typeof contactSmsMessage>[]
>;
