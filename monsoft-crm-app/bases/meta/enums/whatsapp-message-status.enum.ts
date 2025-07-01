import { z } from 'zod';

export const whatsappMessageStatusEnum = z.enum(['sent', 'delivered']);

export type WhatsappMessageStatus = z.infer<typeof whatsappMessageStatusEnum>;
