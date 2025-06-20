import { z } from 'zod';

export const resendEventTypeEnum = z.enum(['email.sent', 'email.delivered']);

export type ResendEventType = z.infer<typeof resendEventTypeEnum>;
