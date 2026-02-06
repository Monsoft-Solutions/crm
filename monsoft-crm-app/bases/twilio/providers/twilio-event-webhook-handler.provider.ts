import express from 'express';

import { twilioEventWebhookPath } from '../constants';

import { twilioEventWebhookBodySchema } from '../schemas';

import { emit } from '@events/providers';

export function twilioEventWebhookHandler(server: express.Express) {
    server.use(twilioEventWebhookPath, express.json());

    server.post(twilioEventWebhookPath, (req, res) => {
        const parsedBody = twilioEventWebhookBodySchema.parse(req.body);

        for (const event of parsedBody) {
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
    });
}
