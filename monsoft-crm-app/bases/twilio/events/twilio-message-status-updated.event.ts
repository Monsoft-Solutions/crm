import { z } from 'zod';

import { contactMessageStatusEnum } from '@mods/contact-message/enums';

export const twilioMessageStatusUpdated = z.object({
    sid: z.string(),
    status: contactMessageStatusEnum,
});

export type twilioMessageStatusUpdatedEvent = z.infer<
    typeof twilioMessageStatusUpdated
>;
