import { z } from 'zod';

export const sendSmsToContactSchema = z.object({
    contactPhoneNumberId: z.string(),
    body: z.string(),
});

export type SendSmsToContact = z.infer<typeof sendSmsToContactSchema>;
