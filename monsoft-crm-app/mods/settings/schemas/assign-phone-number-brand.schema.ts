import { z } from 'zod';

export const assignPhoneNumberBrandSchema = z.object({
    phoneNumber: z.string(),
    brandId: z.string().nullable(),
});

export type AssignPhoneNumberBrand = z.infer<
    typeof assignPhoneNumberBrandSchema
>;
