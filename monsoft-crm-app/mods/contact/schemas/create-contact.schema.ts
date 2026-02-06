import { z } from 'zod';

export const createContactSchema = z.object({
    brandId: z.string(),

    firstName: z.string(),
    lastName: z.string(),

    phoneNumber: z.string(),

    emailAddress: z.string(),

    assistantId: z.string().optional(),
});

export type CreateContact = z.infer<typeof createContactSchema>;
