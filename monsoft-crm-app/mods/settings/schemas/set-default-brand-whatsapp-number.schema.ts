import { z } from 'zod';

export const setDefaultBrandWhatsappNumberSchema = z.object({
    phoneNumber: z.string(),
});

export type SetDefaultBrandWhatsappNumber = z.infer<
    typeof setDefaultBrandWhatsappNumberSchema
>;
