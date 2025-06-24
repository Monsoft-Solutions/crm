import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';
import tables from '@db/db';

import { sendBrandSms } from '@mods/brand/providers';

export const sendSmsToContact = (async ({ contactId, body }) => {
    const { data: contact, error: contactError } = await catchError(
        db.query.contact.findFirst({
            where: (record, { eq }) => eq(record.id, contactId),
            with: {
                phoneNumbers: true,
            },
        }),
    );

    if (contactError) return Error();
    if (!contact) return Error();

    const { brandId, phoneNumbers } = contact;

    const defaultContactPhoneNumber = phoneNumbers.at(0)?.phoneNumber;

    if (!defaultContactPhoneNumber) return Error('NO_DEFAULT_PHONE_NUMBER');

    const { data: message, error: messageError } = await sendBrandSms({
        brandId,
        to: defaultContactPhoneNumber,
        body,
    });

    if (messageError) return Error();

    const { sid } = message;

    const id = uuidv4();

    const { error: dbError } = await catchError(
        db.insert(tables.contactSmsMessage).values({
            id,
            sid,
            contactId,
            contactPhoneNumber: defaultContactPhoneNumber,
            direction: 'outbound',
            body,
        }),
    );

    if (dbError) return Error();

    const result = {
        id,
    };

    return Success(result);
}) satisfies Function<{ contactId: string; body: string }, { id: string }>;
