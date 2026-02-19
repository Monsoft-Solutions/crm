import express from 'express';

import { resendEventWebhookPath } from '../../twilio/constants';

import { resendEventWebhookBodySchema } from '../schemas';
import { resendEventTypeToStatus } from '../utils';

import { emit } from '@events/providers';
import { catchError } from '@errors/utils/catch-error.util';

import { eq } from 'drizzle-orm';
import { db } from '@db/providers/server';
import tables from '@db/db';

import { fetchReceivedEmail } from './fetch-received-email.provider';

export function resendWebhookHandler(server: express.Express) {
    server.use(resendEventWebhookPath, express.json());

    server.post(resendEventWebhookPath, (req, res) => {
        void (async () => {
            const body = req.body as {
                type: string;
                data: { email_id: string };
            };

            // Handle inbound email separately
            if (body.type === 'email.received') {
                const emailId = body.data.email_id;

                const { data: email, error: fetchError } =
                    await fetchReceivedEmail({ emailId });

                if (!fetchError && email) {
                    const to = Array.isArray(email.to)
                        ? email.to[0]
                        : email.to;

                    emit({
                        event: 'resendInboundEmailReceived',
                        payload: {
                            emailId,
                            from: email.from ?? '',
                            to: to ?? '',
                            subject: email.subject ?? '',
                            text: email.text ?? '',
                            html: email.html ?? '',
                            createdAt: Date.now(),
                        },
                    });
                }

                res.status(200).send();
                return;
            }

            // Handle status events (sent, delivered, bounced, complained, delivery_delayed)
            const parseResult =
                resendEventWebhookBodySchema.safeParse(req.body);

            if (!parseResult.success) {
                res.status(200).send();
                return;
            }

            const event = parseResult.data;
            const { email_id: externalId } = event.data;
            const status = resendEventTypeToStatus(event.type);

            const { error: updateError } = await catchError(
                db
                    .update(tables.contactMessage)
                    .set({ status })
                    .where(eq(tables.contactMessage.externalId, externalId)),
            );

            if (updateError) {
                res.status(200).send();
                return;
            }

            const { data: message, error: messageError } = await catchError(
                db.query.contactMessage.findFirst({
                    where: (record, { eq }) =>
                        eq(record.externalId, externalId),
                }),
            );

            if (messageError || !message) {
                res.status(200).send();
                return;
            }

            emit({
                event: 'contactMessageStatusUpdated',
                payload: {
                    id: message.id,
                    contactId: message.contactId,
                    status,
                },
            });

            res.status(200).send();
        })();
    });
}
