import { z } from 'zod';

import { contactMessageStatusEnum } from '@mods/contact-message/enums';

export const emailStatusUpdated = z.object({
    sid: z.string(),
    status: contactMessageStatusEnum,
});

export type emailStatusUpdatedEvent = z.infer<typeof emailStatusUpdated>;
