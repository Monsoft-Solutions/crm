import { z } from 'zod';

import { contactMessageStatusEnum } from '@mods/contact-message/enums';

export const twilioSandboxInboundSchema = z.object({
    MessageSid: z.string(),
    From: z.string(),
    To: z.string(),
    Body: z.string(),
    SmsStatus: z.literal('received'),
});

export const twilioSandboxStatusSchema = z.object({
    MessageSid: z.string(),
    MessageStatus: contactMessageStatusEnum,
});
