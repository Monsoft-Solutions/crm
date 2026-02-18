import express from 'express';

import { twilioSandboxWebhookPath } from '../constants';

import {
    twilioSandboxInboundSchema,
    twilioSandboxStatusSchema,
} from '../schemas';

import { emit } from '@events/providers';

import { logger } from '@log/providers';

export function twilioSandboxWebhookHandler(server: express.Express) {
    server.use(
        twilioSandboxWebhookPath,
        express.urlencoded({ extended: false }),
    );

    server.post(twilioSandboxWebhookPath, (req, res) => {
        const statusResult = twilioSandboxStatusSchema.safeParse(req.body);

        if (statusResult.success) {
            const { MessageSid, MessageStatus } = statusResult.data;

            logger.info('Sandbox status callback received', {
                label: 'twilio-sandbox',
                sid: MessageSid,
                status: MessageStatus,
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

        const inboundResult = twilioSandboxInboundSchema.safeParse(req.body);

        if (inboundResult.success) {
            const { From, To, Body } = inboundResult.data;

            const fromPhoneNumber = From.replace('whatsapp:', '');
            const toPhoneNumber = To.replace('whatsapp:', '');

            logger.info('Sandbox inbound message received', {
                label: 'twilio-sandbox',
                from: fromPhoneNumber,
                to: toPhoneNumber,
            });

            emit({
                event: 'twilioWhatsappMessageReceived',
                payload: {
                    fromPhoneNumber,
                    toPhoneNumber,
                    body: Body,
                    createdAt: Date.now(),
                },
            });

            res.send();
            return;
        }

        logger.warn('Unrecognized sandbox webhook payload', {
            label: 'twilio-sandbox',
        });

        res.status(400).send();
    });
}
