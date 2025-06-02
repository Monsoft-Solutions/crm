import { z } from 'zod';

import { contactChannelTypeEnum } from '@mods/contact-channel/enums';

import {
    contactMessageDirectionEnum,
    contactMessageStatusEnum,
} from '../enums';

export const messageBubblePropsSchema = z.object({
    id: z.string(),
    channelType: contactChannelTypeEnum,
    direction: contactMessageDirectionEnum,
    content: z.string(),
    createdAt: z.number(),
    status: contactMessageStatusEnum,
});

export type MessageBubbleProps = z.infer<typeof messageBubblePropsSchema>;
