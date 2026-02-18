import { z } from 'zod';

export const addMetaWhatsappNumberSchema = z.object({
    phoneNumber: z.string(),
    metaPhoneNumberId: z.string(),
    brandId: z.string(),
});

export type AddMetaWhatsappNumber = z.infer<typeof addMetaWhatsappNumberSchema>;
