import { z } from 'zod';

import { contactMessageStatusEnum } from '@mods/contact-message/enums';

export const smsStatusUpdated = z.object({
    sid: z.string(),
    status: contactMessageStatusEnum,
});

export type SmsStatusUpdatedEvent = z.infer<typeof smsStatusUpdated>;
