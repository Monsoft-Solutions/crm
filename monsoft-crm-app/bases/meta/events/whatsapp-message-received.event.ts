import { z } from 'zod';

export const whatsappMessageReceivedEvent = z.object({
    contactName: z.string(),
    fromPhoneNumber: z.string(),
    toPhoneNumberId: z.string(),
    body: z.string(),
});

export type WhatsappMessageReceivedEvent = z.infer<
    typeof whatsappMessageReceivedEvent
>;
