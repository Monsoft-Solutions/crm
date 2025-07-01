import { z } from 'zod';

export const newContact = z.object({
    brandId: z.string(),
});

export type NewContactEvent = z.infer<typeof newContact>;
