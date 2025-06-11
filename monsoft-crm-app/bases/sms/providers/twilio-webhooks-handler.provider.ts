import express from 'express';

import { twilioEventWebhookHandler } from './twilio-event-webhook-handler.provider';

import { ensureTwilioSinks } from './ensure-twilio-sinks.provider';

export function twilioWebhooksHandler(server: express.Express) {
    twilioEventWebhookHandler(server);

    void (async () => {
        await ensureTwilioSinks();
    })();
}
