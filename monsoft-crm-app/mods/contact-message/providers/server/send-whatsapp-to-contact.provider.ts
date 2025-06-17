import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { sendWhatsappToContactPhoneNumber } from './send-whatsapp-to-contact-phone-number.provider';

export const sendAppWhatsappToContact = (async ({ contactId, body }) => {
    const { data: contactPhoneNumber, error: contactPhoneNumberError } =
        await catchError(
            db.query.contactPhoneNumber.findFirst({
                where: (record, { eq }) => eq(record.contactId, contactId),
            }),
        );

    if (contactPhoneNumberError) return Error();
    if (!contactPhoneNumber) return Error();

    const { data, error } = await sendWhatsappToContactPhoneNumber({
        contactPhoneNumberId: contactPhoneNumber.id,
        body,
    });

    if (error) return Error();

    const { id } = data;

    const result = {
        id,
    };

    return Success(result);
}) satisfies Function<{ contactId: string; body: string }, { id: string }>;
