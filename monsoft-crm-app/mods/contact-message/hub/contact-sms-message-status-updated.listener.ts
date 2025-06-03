import { catchError } from '@errors/utils/catch-error.util';

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
});
