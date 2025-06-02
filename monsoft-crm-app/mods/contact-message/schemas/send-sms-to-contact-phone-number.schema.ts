import { z } from 'zod';

export const sendSmsToContactPhoneNumberSchema = z.object({
    contactPhoneNumberId: z.string(),
    body: z.string(),
});

export type SendSmsToContactPhoneNumber = z.infer<
    typeof sendSmsToContactPhoneNumberSchema
>;
