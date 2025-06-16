import { z } from 'zod';

export const updateContactSchema = z
    .object({
        firstName: z.string(),
        lastName: z.string(),
    })
    .partial();

export type UpdateContact = z.infer<typeof updateContactSchema>;
