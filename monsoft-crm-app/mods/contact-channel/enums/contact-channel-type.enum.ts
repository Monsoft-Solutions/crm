import { z } from 'zod';

export const contactChannelTypeEnum = z.enum([
    'sms',
    'whatsapp',
    'email',
    'messenger',
    'instagram',
]);

export type ContactChannelType = z.infer<typeof contactChannelTypeEnum>;
