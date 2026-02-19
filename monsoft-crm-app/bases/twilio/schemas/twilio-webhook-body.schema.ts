import { z } from 'zod';

import { contactMessageStatusEnum } from '@mods/contact-message/enums';

export const twilioWebhookInboundSchema = z.object({
    MessageSid: z.string(),
    From: z.string(),
    To: z.string(),
    Body: z.string(),
    SmsStatus: z.literal('received'),
});

export const twilioWebhookStatusSchema = z.object({
    MessageSid: z.string(),
    MessageStatus: contactMessageStatusEnum,
    To: z.string().optional(),
    From: z.string().optional(),
});
