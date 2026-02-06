import { z } from 'zod';

export const updateContactSchema = z
    .object({
        firstName: z.string(),
        lastName: z.string(),
        assistantId: z.string().nullable(),
    })
    .partial();

export type UpdateContact = z.infer<typeof updateContactSchema>;
