import { z } from 'zod';

export const createBrandSchema = z.object({
    name: z.string(),
    phoneNumber: z.string(),
    domain: z.string(),
    whatsappPhoneId: z.string(),
    whatsappPhoneNumber: z.string(),
});

export type CreateBrand = z.infer<typeof createBrandSchema>;
