import { z } from 'zod';

import { contactMessageStatusEnum } from '@mods/contact-message/enums';

export const twilioWhatsappMessageStatusUpdated = z.object({
    sid: z.string(),
    status: contactMessageStatusEnum,
});

export type twilioWhatsappMessageStatusUpdatedEvent = z.infer<
    typeof twilioWhatsappMessageStatusUpdated
>;
