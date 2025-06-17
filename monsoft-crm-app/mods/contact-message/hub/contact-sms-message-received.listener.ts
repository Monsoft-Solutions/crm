import { v4 as uuidv4 } from 'uuid';

import { catchError } from '@errors/utils/catch-error.util';

import { emit } from '@events/providers';
import { listen } from '@events/providers/listen.provider';

import { db } from '@db/providers/server';

import tables from '@db/db';

void listen('twilioMessageReceived', async ({ from, body, createdAt }) => {
    const id = uuidv4();

    const { data: contactPhoneNumber, error: contactPhoneNumberError } =
        await catchError(
            db.query.contactPhoneNumber.findFirst({
                where: (record, { eq }) => eq(record.phoneNumber, from),
            }),
        );

    if (contactPhoneNumberError) return;
    if (!contactPhoneNumber) return;

    const { id: contactPhoneNumberId, contactId } = contactPhoneNumber;

    const { error: contactSmsMessageError } = await catchError(
        db.insert(tables.contactSmsMessage).values({
            id,
            contactPhoneNumberId,
            direction: 'inbound',
            body,
        }),
    );

    if (contactSmsMessageError) return;

    emit({
        event: 'newContactMessage',
        payload: {
            id,
            contactId,
            channelType: 'sms',
            direction: 'inbound',
            body,
            createdAt,
        },
    });
});
