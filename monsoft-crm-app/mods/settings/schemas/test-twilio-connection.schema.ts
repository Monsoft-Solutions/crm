import { z } from 'zod';

export const testTwilioConnectionSchema = z.object({
    twilioSid: z.string(),
    twilioToken: z.string(),
});

export type TestTwilioConnection = z.infer<typeof testTwilioConnectionSchema>;
