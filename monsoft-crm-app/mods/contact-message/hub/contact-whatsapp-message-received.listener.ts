import { v4 as uuidv4 } from 'uuid';

import { catchError } from '@errors/utils/catch-error.util';

import { listen } from '@events/providers/listen.provider';
import { emit } from '@events/providers';

import { db } from '@db/providers/server';

import tables from '@db/db';

void listen(
    'twilioWhatsappMessageReceived',

    async ({ fromPhoneNumber, toPhoneNumber, body }) => {
        const { data: brandWhatsappNumber, error: brandWhatsappNumberError } =
            await catchError(
                db.query.brandWhatsappNumber.findFirst({
                    where: (record, { eq }) =>
                        eq(record.phoneNumber, toPhoneNumber),

                    with: {
                        brand: true,
                    },
                }),
            );

        if (brandWhatsappNumberError) return;

        if (!brandWhatsappNumber) return;

        const { brand } = brandWhatsappNumber;

        const { data: contactPhoneNumbers, error: contactPhoneNumberError } =
            await catchError(
                db.query.contactPhoneNumber.findMany({
                    where: (record, { eq }) =>
                        eq(record.phoneNumber, fromPhoneNumber),

                    with: {
                        contact: true,
                    },
                }),
            );

        if (contactPhoneNumberError) return;

        const matchedPhoneNumber = contactPhoneNumbers.find(
            (cp) => cp.contact.brandId === brand.id,
        );

        let contactId: string;

        if (matchedPhoneNumber) {
            contactId = matchedPhoneNumber.contactId;
        } else {
            contactId = uuidv4();

            const { error: insertContactError } = await catchError(
                db.insert(tables.contact).values({
                    id: contactId,
                    brandId: brand.id,
                    firstName: '',
                    lastName: '',
                    assistantId: brand.defaultAssistantId,
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

            emit({
                event: 'newContact',
                payload: {
                    brandId: brand.id,
                },
            });
        }

        const messageId = uuidv4();

        const { error: insertMessageError } = await catchError(
            db.insert(tables.contactMessage).values({
                id: messageId,
                contactId,
                channel: 'whatsapp',
                fromAddress: fromPhoneNumber,
                toAddress: toPhoneNumber,
                direction: 'inbound',
                body,
            }),
        );

        if (insertMessageError) return;

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
