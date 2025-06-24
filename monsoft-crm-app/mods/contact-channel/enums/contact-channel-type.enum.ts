import { z } from 'zod';

export const contactChannelTypeEnum = z.enum(['sms', 'whatsapp', 'email']);

export type ContactChannelType = z.infer<typeof contactChannelTypeEnum>;
