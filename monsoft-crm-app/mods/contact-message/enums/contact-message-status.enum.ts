import { z } from 'zod';

export const contactMessageStatusEnum = z.enum([
    'accepted',
    'queued',
    'sending',
    'sent',
    'delivered',
    'read',
    'undelivered',
    'failed',
]);

export type ContactMessageStatus = z.infer<typeof contactMessageStatusEnum>;
