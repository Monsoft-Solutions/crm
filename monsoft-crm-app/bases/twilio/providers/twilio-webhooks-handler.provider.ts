import express from 'express';

import { twilioEventWebhookHandler } from './twilio-event-webhook-handler.provider';
import { twilioSandboxWebhookHandler } from './twilio-sandbox-webhook-handler.provider';

import { ensureTwilioSinks } from './ensure-twilio-sinks.provider';

export function twilioWebhooksHandler(server: express.Express) {
    twilioEventWebhookHandler(server);
    twilioSandboxWebhookHandler(server);

    void (async () => {
        await ensureTwilioSinks();
    })();
}
