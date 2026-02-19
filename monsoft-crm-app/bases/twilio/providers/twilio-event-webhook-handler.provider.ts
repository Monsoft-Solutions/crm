import express from 'express';

import { twilioEventWebhookPath } from '../constants';

import {
    twilioEventWebhookBodySchema,
    twilioWebhookInboundSchema,
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
            const { MessageSid, MessageStatus } = statusResult.data;

            logger.info('[twilioEventWebhook] Status callback received', {
                sid: MessageSid,
                status: MessageStatus,
            });

            emit({
                event: 'twilioMessageStatusUpdated',
                payload: {
                    sid: MessageSid,
                    status: MessageStatus,
                },
            });

            emit({
                event: 'twilioWhatsappMessageStatusUpdated',
                payload: {
                    sid: MessageSid,
                    status: MessageStatus,
                },
            });

            res.send();
            return;
        }

        // Standard Twilio webhook format (urlencoded): inbound message
        const inboundResult = twilioWebhookInboundSchema.safeParse(req.body);

        if (inboundResult.success) {
            const { From, To, Body } = inboundResult.data;

            const isWhatsapp = From.startsWith('whatsapp:');

            if (isWhatsapp) {
                const fromPhone = From.replace('whatsapp:', '');
                const toPhone = To.replace('whatsapp:', '');

                logger.info('[twilioEventWebhook] Inbound WhatsApp message', {
                    from: fromPhone,
                    to: toPhone,
                });

                emit({
                    event: 'twilioWhatsappMessageReceived',
                    payload: {
                        fromPhoneNumber: fromPhone,
                        toPhoneNumber: toPhone,
                        body: Body,
                        createdAt: Date.now(),
                    },
                });
            } else {
                logger.info('[twilioEventWebhook] Inbound SMS message', {
                    from: From,
                    to: To,
                });

                emit({
                    event: 'twilioMessageReceived',
                    payload: {
                        from: From,
                        to: To,
                        body: Body,
                        createdAt: Date.now(),
                    },
                });
            }

            res.send();
            return;
        }

        // Twilio Event Streams format (JSON)
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
                        const { messageSid } = event.data;

                        emit({
                            event: 'twilioMessageStatusUpdated',
                            payload: {
                                sid: messageSid,
                                status: 'sent',
                            },
                        });

                        emit({
                            event: 'twilioWhatsappMessageStatusUpdated',
                            payload: {
                                sid: messageSid,
                                status: 'sent',
                            },
                        });

                        break;
                    }

                    case 'com.twilio.messaging.message.delivered': {
                        const { messageSid } = event.data;

                        emit({
                            event: 'twilioMessageStatusUpdated',
                            payload: {
                                sid: messageSid,
                                status: 'delivered',
                            },
                        });

                        emit({
                            event: 'twilioWhatsappMessageStatusUpdated',
                            payload: {
                                sid: messageSid,
                                status: 'delivered',
                            },
                        });

                        break;
                    }

                    case 'com.twilio.messaging.message.read': {
                        const { messageSid } = event.data;

                        emit({
                            event: 'twilioWhatsappMessageStatusUpdated',
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
