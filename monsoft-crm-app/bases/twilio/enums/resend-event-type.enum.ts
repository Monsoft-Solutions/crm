import { z } from 'zod';

export const resendEventTypeEnum = z.enum([
    'email.sent',
    'email.delivered',
    'email.bounced',
    'email.complained',
    'email.delivery_delayed',
    'email.received',
]);

export type ResendEventType = z.infer<typeof resendEventTypeEnum>;
