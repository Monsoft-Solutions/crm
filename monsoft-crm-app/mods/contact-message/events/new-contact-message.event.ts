import { z } from 'zod';

import { contactChannelTypeEnum } from '@mods/contact-channel/enums';
import { contactMessageDirectionEnum } from '../enums';

export const newContactMessage = z.object({
    id: z.string(),
    contactId: z.string(),
    channelType: contactChannelTypeEnum,
    direction: contactMessageDirectionEnum,
    body: z.string(),
});

export type NewContactMessageEvent = z.infer<typeof newContactMessage>;
