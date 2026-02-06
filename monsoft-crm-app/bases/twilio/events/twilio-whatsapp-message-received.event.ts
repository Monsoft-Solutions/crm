import { z } from 'zod';

export const twilioWhatsappMessageReceived = z.object({
    fromPhoneNumber: z.string(),
    toPhoneNumber: z.string(),
    body: z.string(),
    createdAt: z.number(),
});

export type twilioWhatsappMessageReceivedEvent = z.infer<
    typeof twilioWhatsappMessageReceived
>;
