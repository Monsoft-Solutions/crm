import { catchError } from '@errors/utils/catch-error.util';

import { emit } from '@events/providers';
import { listen } from '@events/providers/listen.provider';

import { db } from '@db/providers/server';

import tables from '@db/db';
import { eq } from 'drizzle-orm';

void listen('smsStatusUpdated', async ({ sid, status }) => {
    const { error: contactSmsMessageUpdateError } = await catchError(
        db
            .update(tables.contactSmsMessage)
            .set({
                status,
            })
            .where(eq(tables.contactSmsMessage.sid, sid)),
    );

    if (contactSmsMessageUpdateError) return;

    const { data: contactSmsMessage, error: contactSmsMessageError } =
        await catchError(
            db.query.contactSmsMessage.findFirst({
                where: (record, { eq }) => eq(record.sid, sid),
                with: {
                    contactPhoneNumber: {
                        with: {
                            contact: true,
                        },
                    },
                },
            }),
        );

    if (contactSmsMessageError) return;
    if (!contactSmsMessage) return;

    const { id, contactPhoneNumber } = contactSmsMessage;
    const { contactId } = contactPhoneNumber;

    emit({
        event: 'contactMessageStatusUpdated',
        payload: {
            id,
            contactId,
            status,
        },
    });
});
