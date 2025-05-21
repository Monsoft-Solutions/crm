import { userLangEnumSchema } from '@auth/enum/user-lang.enum';
import { z } from 'zod';

// Sign up form schema
export const signUpFormSchema = z.object({
    firstName: z.string(),

    lastName: z.string().optional(),

    email: z.string(),

    password: z.string(),

    language: userLangEnumSchema,
});

// Sign up form type
export type SignUpForm = z.infer<typeof signUpFormSchema>;
