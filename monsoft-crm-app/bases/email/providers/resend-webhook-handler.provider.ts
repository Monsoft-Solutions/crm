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

            const { email_id: sid } = event.data;

            const status = resendEventTypeToStatus(event.type);

            const { error: contactSmsMessageUpdateError } = await catchError(
                db
                    .update(tables.contactEmail)
                    .set({
                        status,
                    })
                    .where(eq(tables.contactEmail.sid, sid)),
            );

            if (contactSmsMessageUpdateError) return;

            const { data: contactEmail, error: contactEmailError } =
                await catchError(
                    db.query.contactEmail.findFirst({
                        where: (record, { eq }) => eq(record.sid, sid),
                        with: {
                            contactEmailAddress: {
                                with: {
                                    contact: true,
                                },
                            },
                        },
                    }),
                );

            if (contactEmailError) return;
            if (!contactEmail) return;

            const { id, contactEmailAddress } = contactEmail;
            const { contactId } = contactEmailAddress;

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
