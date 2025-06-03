import { z } from 'zod';

export const smsStatusUpdated = z.object({
    sid: z.string(),
    status: z.string(),
});

export type SmsStatusUpdatedEvent = z.infer<typeof smsStatusUpdated>;
