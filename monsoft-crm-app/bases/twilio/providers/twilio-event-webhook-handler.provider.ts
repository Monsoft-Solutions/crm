import express from 'express';

import { twilioEventWebhookPath } from '../constants';

import {
    twilioEventWebhookBodySchema,
    twilioWebhookStatusSchema,
} from '../schemas';

import { emit } from '@events/providers';

import { logger } from '@log/providers';

export function twilioEventWebhookHandler(server: express.Express) {
    server.use(twilioEventWebhookPath, express.json());
    server.use(twilioEventWebhookPath, express.urlencoded({ extended: false }));

    server.post(twilioEventWebhookPath, (req, res) => {
        // Standard Twilio webhook format (urlencoded): status callback
        const statusResult = twilioWebhookStatusSchema.safeParse(req.body);

        if (statusResult.success) {
            const { MessageSid, MessageStatus, To, From } = statusResult.data;

            const isWhatsapp =
                To?.startsWith('whatsapp:') === true ||
                From?.startsWith('whatsapp:') === true;

            logger.info('[twilioEventWebhook] Status callback received', {
                sid: MessageSid,
                status: MessageStatus,
                isWhatsapp,
            });

            if (isWhatsapp) {
                emit({
                    event: 'twilioWhatsappMessageStatusUpdated',
                    payload: {
                        sid: MessageSid,
                        status: MessageStatus,
                    },
                });
            } else {
                emit({
                    event: 'twilioMessageStatusUpdated',
                    payload: {
                        sid: MessageSid,
                        status: MessageStatus,
                    },
                });
            }

            res.send();
            return;
        }

        // Twilio Event Streams format (JSON) — handles inbound messages + status updates
        const eventResult = twilioEventWebhookBodySchema.safeParse(req.body);

        if (eventResult.success) {
            for (const event of eventResult.data) {
                switch (event.type) {
                    case 'com.twilio.messaging.inbound-message.received': {
                        const { from, to, body } = event.data;

                        const isWhatsapp = from.startsWith('whatsapp:');

                        if (isWhatsapp) {
                            const fromPhone = from.replace('whatsapp:', '');
                            const toPhone = to.replace('whatsapp:', '');

                            emit({
                                event: 'twilioWhatsappMessageReceived',
                                payload: {
                                    fromPhoneNumber: fromPhone,
                                    toPhoneNumber: toPhone,
                                    body,
                                    createdAt: Date.now(),
                                },
                            });
                        } else {
                            emit({
                                event: 'twilioMessageReceived',
                                payload: {
                                    from,
                                    to,
                                    body,
                                    createdAt: Date.now(),
                                },
                            });
                        }

                        break;
                    }

                    case 'com.twilio.messaging.message.sent': {
                        const { messageSid, from } = event.data;
                        const isWa = from?.startsWith('whatsapp:');

                        emit({
                            event: isWa
                                ? 'twilioWhatsappMessageStatusUpdated'
                                : 'twilioMessageStatusUpdated',
                            payload: {
                                sid: messageSid,
                                status: 'sent',
                            },
                        });

                        break;
                    }

                    case 'com.twilio.messaging.message.delivered': {
                        const { messageSid, from } = event.data;
                        const isWa = from?.startsWith('whatsapp:');

                        emit({
                            event: isWa
                                ? 'twilioWhatsappMessageStatusUpdated'
                                : 'twilioMessageStatusUpdated',
                            payload: {
                                sid: messageSid,
                                status: 'delivered',
                            },
                        });

                        break;
                    }

                    case 'com.twilio.messaging.message.read': {
                        const { messageSid, from } = event.data;
                        const isWa = from?.startsWith('whatsapp:');

                        emit({
                            event: isWa
                                ? 'twilioWhatsappMessageStatusUpdated'
                                : 'twilioMessageStatusUpdated',
                            payload: {
                                sid: messageSid,
                                status: 'read',
                            },
                        });

                        break;
                    }
                }
            }

            res.send();
            return;
        }

        logger.warn('[twilioEventWebhook] Unknown event payload', {
            body: JSON.stringify(req.body),
        });
        res.send();
    });
}
