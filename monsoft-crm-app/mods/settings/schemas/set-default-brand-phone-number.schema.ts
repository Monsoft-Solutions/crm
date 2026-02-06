import { z } from 'zod';

export const setDefaultBrandPhoneNumberSchema = z.object({
    phoneNumber: z.string(),
});

export type SetDefaultBrandPhoneNumber = z.infer<
    typeof setDefaultBrandPhoneNumberSchema
>;
