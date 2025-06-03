import express from 'express';

import { twilioIncomingSmsWebhookHandler } from './twilio-incoming-sms-webhook-handler.provider';
import { twilioStatusUpdatedWebhookHandler } from './twilio-status-updated-webhook-handler.provider';

export function twilioWebhooksHandler(server: express.Express) {
    twilioIncomingSmsWebhookHandler(server);
    twilioStatusUpdatedWebhookHandler(server);
}
