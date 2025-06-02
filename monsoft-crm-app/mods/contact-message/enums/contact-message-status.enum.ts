import { z } from 'zod';

export const contactMessageStatusEnum = z.enum([
    'queued',
    'sent',
    'delivered',
    'read',
]);

export type ContactMessageStatus = z.infer<typeof contactMessageStatusEnum>;
