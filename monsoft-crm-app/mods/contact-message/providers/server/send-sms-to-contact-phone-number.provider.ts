import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';
import tables from '@db/db';

import { sendSms } from '@sms/providers';

export const sendSmsToContactPhoneNumber = (async ({
    contactPhoneNumberId,
    body,
}) => {
    const { data: contactPhoneNumber, error: contactPhoneNumberError } =
        await catchError(
            db.query.contactPhoneNumber.findFirst({
                where: (record, { eq }) => eq(record.id, contactPhoneNumberId),
            }),
        );

    if (contactPhoneNumberError) return Error();

    if (contactPhoneNumber === undefined) return Error();

    const { phoneNumber } = contactPhoneNumber;

    const { data: message, error: messageError } = await sendSms({
        to: phoneNumber,
        body,
    });

    if (messageError) return Error();

    const { sid } = message;

    const id = uuidv4();

    const { error: dbError } = await catchError(
        db.insert(tables.contactSmsMessage).values({
            id,
            sid,
            contactPhoneNumberId,
            direction: 'outbound',
            body,
        }),
    );

    if (dbError) return Error();

    return Success();
}) satisfies Function<{ contactPhoneNumberId: string; body: string }>;
