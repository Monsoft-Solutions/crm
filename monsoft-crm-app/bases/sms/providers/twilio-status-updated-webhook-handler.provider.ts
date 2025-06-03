import express from 'express';

import { twilioStatusUpdateWebhookPath } from '../constants';

import { twilioStatusUpdateWebhookBodySchema } from '../schemas';

import { emit } from '@events/providers';

export function twilioStatusUpdatedWebhookHandler(server: express.Express) {
    server.use(
        twilioStatusUpdateWebhookPath,
        express.urlencoded({
            extended: false,
        }),
    );

    server.post(twilioStatusUpdateWebhookPath, (req, res) => {
        const parsedBody = twilioStatusUpdateWebhookBodySchema.parse(req.body);

        const { MessageSid, MessageStatus } = parsedBody;

        emit({
            event: 'smsStatusUpdated',
            payload: {
                sid: MessageSid,
                status: MessageStatus,
            },
        });

        res.send();
    });
}
