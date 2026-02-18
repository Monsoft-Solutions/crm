import { catchError } from '@errors/utils/catch-error.util';

import { emit } from '@events/providers';
import { listen } from '@events/providers/listen.provider';

import { db } from '@db/providers/server';

import tables from '@db/db';
import { eq } from 'drizzle-orm';

void listen('whatsappMessageStatusUpdatedEvent', async ({ sid, status }) => {
    const { error: contactWhatsappMessageUpdateError } = await catchError(
        db
            .update(tables.contactWhatsappMessage)
            .set({
                status,
            })
            .where(eq(tables.contactWhatsappMessage.sid, sid)),
    );

    if (contactWhatsappMessageUpdateError) return;

    const { data: contactWhatsappMessage, error: contactWhatsappMessageError } =
        await catchError(
            db.query.contactWhatsappMessage.findFirst({
                where: (record, { eq }) => eq(record.sid, sid),
                with: {
                    contact: true,
                },
            }),
        );

    if (contactWhatsappMessageError) return;
    if (!contactWhatsappMessage) return;

    const { id, contactId } = contactWhatsappMessage;

    emit({
        event: 'contactMessageStatusUpdated',
        payload: {
            id,
            contactId,
            status,
        },
    });
});
