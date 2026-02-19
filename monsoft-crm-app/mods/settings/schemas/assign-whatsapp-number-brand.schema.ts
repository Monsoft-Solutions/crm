import { z } from 'zod';

export const assignWhatsappNumberBrandSchema = z.object({
    phoneNumber: z.string(),
    brandId: z.string().nullable(),
});

export type AssignWhatsappNumberBrand = z.infer<
    typeof assignWhatsappNumberBrandSchema
>;
