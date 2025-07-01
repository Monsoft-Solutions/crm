import { z } from 'zod';

export const twilioMessageReceived = z.object({
    from: z.string(),
    to: z.string(),
    body: z.string(),
    createdAt: z.number(),
});

export type twilioMessageReceivedEvent = z.infer<typeof twilioMessageReceived>;
