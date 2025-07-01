import { z } from 'zod';

import { whatsappMessageStatusEnum } from '../enums';

export const whatsappMessageStatusUpdatedEvent = z.object({
    sid: z.string(),
    status: whatsappMessageStatusEnum,
});

export type WhatsappMessageStatusUpdatedEvent = z.infer<
    typeof whatsappMessageStatusUpdatedEvent
>;
