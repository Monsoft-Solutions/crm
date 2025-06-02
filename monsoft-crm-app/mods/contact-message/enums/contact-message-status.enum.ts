import { z } from 'zod';

export const contactMessageStatusEnum = z.enum(['queued', 'sent', 'delivered']);

export type ContactMessageStatus = z.infer<typeof contactMessageStatusEnum>;
