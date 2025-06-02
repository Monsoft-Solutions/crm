import { z } from 'zod';

// sms-received event schema
export const smsReceived = z.object({
    from: z.string(),
    body: z.string(),
});

// sms-received event type
export type SmsReceivedEvent = z.infer<typeof smsReceived>;
