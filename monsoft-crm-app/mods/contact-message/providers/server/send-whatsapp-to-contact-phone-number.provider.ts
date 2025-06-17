import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';
import tables from '@db/db';

import { sendAppWhatsapp } from '@whatsapp/providers';

export const sendWhatsappToContactPhoneNumber = (async ({
    contactPhoneNumberId,
    body,
}) => {
    const { data: contactPhoneNumber, error: contactPhoneNumberError } =
        await catchError(
            db.query.contactPhoneNumber.findFirst({
                where: (record, { eq }) => eq(record.id, contactPhoneNumberId),
                with: {
                    contact: {
                        with: {
                            brand: true,
                        },
                    },
                },
            }),
        );

    if (contactPhoneNumberError) return Error();

    if (contactPhoneNumber === undefined) return Error();

    const { contact, phoneNumber: toPhoneNumber } = contactPhoneNumber;

    const { brandId } = contact;
    console.log('-->   ~ brandId:', brandId);

    // TODO: use send-brand-whatsapp

    const { data: message, error: messageError } = await sendAppWhatsapp({
        to: toPhoneNumber,
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

    const result = {
        id,
    };

    return Success(result);
}) satisfies Function<
    { contactPhoneNumberId: string; body: string },
    { id: string }
>;
