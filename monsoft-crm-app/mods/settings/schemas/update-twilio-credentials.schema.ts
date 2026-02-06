import { z } from 'zod';

export const updateTwilioCredentialsSchema = z.object({
    twilioSid: z.string(),
    twilioToken: z.string(),
});

export type UpdateTwilioCredentials = z.infer<
    typeof updateTwilioCredentialsSchema
>;
