import { v4 as uuidv4 } from 'uuid';

import { catchError } from '@errors/utils/catch-error.util';

import { listen } from '@events/providers/listen.provider';
import { emit } from '@events/providers';

import { db } from '@db/providers/server';

import tables from '@db/db';

void listen(
    'whatsappMessageReceivedEvent',

    async ({ contactName, fromPhoneNumber, toPhoneNumberId, body }) => {
        const { data: brandWhatsappNumber, error: brandWhatsappNumberError } =
            await catchError(
                db.query.brandWhatsappNumber.findFirst({
                    where: (record, { eq }) =>
                        eq(record.phoneId, toPhoneNumberId),

                    with: {
                        brand: true,
                    },
                }),
            );

        if (brandWhatsappNumberError) return;

        if (!brandWhatsappNumber) return;

        const { brand } = brandWhatsappNumber;

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
                    firstName: contactName,
                    lastName: '',
                }),
            );

            if (insertContactError) return;

            const { error: insertContactPhoneNumberError } = await catchError(
                db.insert(tables.contactPhoneNumber).values({
                    id: uuidv4(),
                    contactId,
                    phoneNumber: fromPhoneNumber,
                    isDefault: 'true',
                }),
            );

            if (insertContactPhoneNumberError) return;
        }

        const messageId = uuidv4();

        const { error: insertContactWhatsappMessageError } = await catchError(
            db.insert(tables.contactWhatsappMessage).values({
                id: messageId,
                contactId,
                contactWhatsappNumber: fromPhoneNumber,
                direction: 'inbound',
                body,
            }),
        );

        if (insertContactWhatsappMessageError) return;

        emit({
            event: 'newContactMessage',
            payload: {
                id: messageId,
                contactId,
                channelType: 'whatsapp',
                direction: 'inbound',
                body,
                createdAt: Date.now(),
            },
        });
    },
);
