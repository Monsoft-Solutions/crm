import { z } from 'zod';

export const createBrandSchema = z.object({
    name: z.string(),
});

export type CreateBrand = z.infer<typeof createBrandSchema>;
