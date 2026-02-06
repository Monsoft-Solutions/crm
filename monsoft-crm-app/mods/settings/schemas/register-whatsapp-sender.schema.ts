import { z } from 'zod';

export const registerWhatsappSenderSchema = z.object({
    phoneNumberSid: z.string(),
});

export type RegisterWhatsappSender = z.infer<
    typeof registerWhatsappSenderSchema
>;
