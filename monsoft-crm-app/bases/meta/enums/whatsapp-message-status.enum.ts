import { z } from 'zod';

export const whatsappMessageStatusEnum = z.enum(['sent', 'delivered', 'read']);

export type WhatsappMessageStatus = z.infer<typeof whatsappMessageStatusEnum>;
