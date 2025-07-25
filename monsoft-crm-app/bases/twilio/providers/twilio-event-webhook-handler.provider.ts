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

                    emit({
                        event: 'twilioMessageReceived',
                        payload: {
                            from,
                            to,
                            body,
                            createdAt: Date.now(),
                        },
                    });

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

                    break;
                }
            }
        }

        res.send();
    });
}
