import { z } from 'zod';

import { contactMessageStatusEnum } from '@mods/contact-message/enums';

export const twilioWebhookStatusSchema = z.object({
    MessageSid: z.string(),
    MessageStatus: contactMessageStatusEnum,
    To: z.string().optional(),
    From: z.string().optional(),
});
