import express from 'express';

import { resendEventWebhookPath } from '../../twilio/constants';

import { resendEventWebhookBodySchema } from '../schemas';

import { resendEventTypeToStatus } from '../utils';

import { emit } from '@events/providers';
import { catchError } from '@errors/utils/catch-error.util';

import { eq } from 'drizzle-orm';
import { db } from '@db/providers/server';
import tables from '@db/db';

export function resendWebhookHandler(server: express.Express) {
    server.use(resendEventWebhookPath, express.json());

    server.post(resendEventWebhookPath, (req, res) => {
        void (async () => {
            const event = resendEventWebhookBodySchema.parse(req.body);

            const { email_id: externalId } = event.data;

            const status = resendEventTypeToStatus(event.type);

            const { error: updateError } = await catchError(
                db
                    .update(tables.contactMessage)
                    .set({ status })
                    .where(eq(tables.contactMessage.externalId, externalId)),
            );

            if (updateError) return;

            const { data: message, error: messageError } = await catchError(
                db.query.contactMessage.findFirst({
                    where: (record, { eq }) =>
                        eq(record.externalId, externalId),
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

            res.send();
        })();
    });
}
