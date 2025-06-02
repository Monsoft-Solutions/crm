import { z } from 'zod';

export const twilioIncomingSmsWebhookBodySchema = z.object({
    From: z.string(),
    Body: z.string(),
});
