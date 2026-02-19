import { catchError } from '@errors/utils/catch-error.util';

import { emit } from '@events/providers';
import { listen } from '@events/providers/listen.provider';

import { db } from '@db/providers/server';

import tables from '@db/db';
import { eq } from 'drizzle-orm';

void listen('twilioWhatsappMessageStatusUpdated', async ({ sid, status }) => {
    const { error: updateError } = await catchError(
        db
            .update(tables.contactMessage)
            .set({ status })
            .where(eq(tables.contactMessage.externalId, sid)),
    );

    if (updateError) return;

    const { data: message, error: messageError } = await catchError(
        db.query.contactMessage.findFirst({
            where: (record, { eq }) => eq(record.externalId, sid),
        }),
    );

    if (messageError) return;
    if (!message) return;

    const { id, contactId } = message;

    emit({
        event: 'contactMessageStatusUpdated',
        payload: {
            id,
            contactId,
            status,
        },
    });
});
