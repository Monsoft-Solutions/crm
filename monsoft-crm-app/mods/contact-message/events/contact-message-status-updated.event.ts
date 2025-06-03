import { z } from 'zod';

import { contactMessageStatusEnum } from '../enums';

export const contactMessageStatusUpdated = z.object({
    id: z.string(),
    contactId: z.string(),
    status: contactMessageStatusEnum,
});

export type ContactMessageStatusUpdatedEvent = z.infer<
    typeof contactMessageStatusUpdated
>;
