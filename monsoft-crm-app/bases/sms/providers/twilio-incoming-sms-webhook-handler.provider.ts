import express from 'express';

import { twilioIncomingSmsWebhookPath } from '../constants';

import { twilioIncomingSmsWebhookBodySchema } from '../schemas';

import { emit } from '@events/providers';

export function twilioIncomingSmsWebhookHandler(server: express.Express) {
    server.use(
        twilioIncomingSmsWebhookPath,
        express.urlencoded({
            extended: false,
        }),
    );

    server.post(twilioIncomingSmsWebhookPath, (req, res) => {
        const parsedBody = twilioIncomingSmsWebhookBodySchema.parse(req.body);

        const { From, Body } = parsedBody;

        emit({
            event: 'smsReceived',
            payload: {
                from: From,
                body: Body,
            },
        });

        res.send();
    });
}
