import { z } from 'zod';

export const createBrandSchema = z.object({
    name: z.string(),
    phoneNumber: z.string().optional(),
});

export type CreateBrand = z.infer<typeof createBrandSchema>;
