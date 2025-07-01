import { v4 as uuidv4 } from 'uuid';

import { catchError } from '@errors/utils/catch-error.util';

import { emit } from '@events/providers';
import { listen } from '@events/providers/listen.provider';

import { db } from '@db/providers/server';

import tables from '@db/db';

void listen(
    'twilioMessageReceived',

    async ({ from: fromPhoneNumber, to, body, createdAt }) => {
        const { data: brandPhoneNumber, error: brandPhoneNumberError } =
            await catchError(
                db.query.brandPhoneNumber.findFirst({
                    where: (record, { eq }) => eq(record.phoneNumber, to),

                    with: {
                        brand: true,
                    },
                }),
            );

        if (brandPhoneNumberError) return;

        if (!brandPhoneNumber) return;

        const { brand } = brandPhoneNumber;

        const { data: contactPhoneNumber, error: contactPhoneNumberError } =
            await catchError(
                db.query.contactPhoneNumber.findFirst({
                    where: (record, { eq }) =>
                        eq(record.phoneNumber, fromPhoneNumber),

                    with: {
                        contact: true,
                    },
                }),
            );

        if (contactPhoneNumberError) return;

        let contactId: string;

        if (
            contactPhoneNumber &&
            contactPhoneNumber.contact.brandId === brand.id
        ) {
            contactId = contactPhoneNumber.contactId;
        } else {
            contactId = uuidv4();

            const { error: insertContactError } = await catchError(
                db.insert(tables.contact).values({
                    id: contactId,
                    brandId: brand.id,
                    firstName: '',
                    lastName: '',
                }),
            );

            if (insertContactError) return;

            const { error: insertContactPhoneNumberError } = await catchError(
                db.insert(tables.contactPhoneNumber).values({
                    id: uuidv4(),
                    contactId,
                    phoneNumber: fromPhoneNumber,
                }),
            );

            if (insertContactPhoneNumberError) return;
        }

        const messageId = uuidv4();

        const { error: insertContactSmsMessageError } = await catchError(
            db.insert(tables.contactSmsMessage).values({
                id: messageId,
                contactId,
                contactPhoneNumber: fromPhoneNumber,
                direction: 'inbound',
                body,
                createdAt,
            }),
        );

        if (insertContactSmsMessageError) return;

        emit({
            event: 'newContactMessage',
            payload: {
                id: messageId,
                contactId,
                channelType: 'sms',
                direction: 'inbound',
                body,
                createdAt: Date.now(),
            },
        });
    },
);
