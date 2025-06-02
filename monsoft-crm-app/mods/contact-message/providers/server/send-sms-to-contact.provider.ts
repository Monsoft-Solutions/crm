import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { sendSmsToContactPhoneNumber } from './send-sms-to-contact-phone-number.provider';

export const sendSmsToContact = (async ({ contactId, body }) => {
    const { data: contactPhoneNumber, error: contactPhoneNumberError } =
        await catchError(
            db.query.contactPhoneNumber.findFirst({
                where: (record, { eq }) => eq(record.contactId, contactId),
            }),
        );

    if (contactPhoneNumberError) return Error();
    if (!contactPhoneNumber) return Error();

    const { error } = await sendSmsToContactPhoneNumber({
        contactPhoneNumberId: contactPhoneNumber.id,
        body,
    });

    if (error) return Error();

    return Success();
}) satisfies Function<{ contactId: string; body: string }>;
