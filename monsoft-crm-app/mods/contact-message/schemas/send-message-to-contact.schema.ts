import { z } from 'zod';

import { contactChannelTypeEnum } from '@mods/contact-channel/enums';

export const sendMessageToContactSchema = z.object({
    contactId: z.string(),
    channelType: contactChannelTypeEnum,
    body: z.string(),
    subject: z.string().optional(),
});

export type SendMessageToContact = z.infer<typeof sendMessageToContactSchema>;
