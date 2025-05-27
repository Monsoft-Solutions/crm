import { z } from 'zod';

export const sendEmailToContactSchema = z.object({
    contactEmailAddressId: z.string(),
    body: z.string(),
});

export type SendEmailToContact = z.infer<typeof sendEmailToContactSchema>;
