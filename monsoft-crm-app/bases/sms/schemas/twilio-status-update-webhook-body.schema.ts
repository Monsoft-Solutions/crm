import { z } from 'zod';

import { contactMessageStatusEnum } from '@mods/contact-message/enums';

export const twilioStatusUpdateWebhookBodySchema = z.object({
    MessageSid: z.string(),
    MessageStatus: contactMessageStatusEnum,
});
