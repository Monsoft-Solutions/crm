import { z } from 'zod';

export const contactChannelTypeEnum = z.enum([
    'sms',
    'email',
    'slack',
    'whatsapp',
    'instagram',
]);

export type ContactChannelType = z.infer<typeof contactChannelTypeEnum>;
