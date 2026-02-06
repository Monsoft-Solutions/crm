import { z } from 'zod';

export const registerWhatsappSenderSchema = z.object({
    phoneNumber: z.string(),
});

export type RegisterWhatsappSender = z.infer<
    typeof registerWhatsappSenderSchema
>;
