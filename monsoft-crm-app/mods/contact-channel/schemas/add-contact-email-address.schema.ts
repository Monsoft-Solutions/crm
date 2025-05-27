import { z } from 'zod';

export const addContactEmailAddressSchema = z.object({
    contactId: z.string(),
    emailAddress: z.string(),
});

export type AddContactEmailAddress = z.infer<
    typeof addContactEmailAddressSchema
>;
