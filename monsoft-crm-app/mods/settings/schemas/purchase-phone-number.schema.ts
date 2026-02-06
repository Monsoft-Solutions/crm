import { z } from 'zod';

export const purchasePhoneNumberSchema = z.object({
    phoneNumber: z.string(),
});

export type PurchasePhoneNumber = z.infer<typeof purchasePhoneNumberSchema>;
