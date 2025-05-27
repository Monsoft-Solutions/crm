import { z } from 'zod';

import { langCodeEnum } from '@lang/enum';

// Sign up form schema
export const signUpFormSchema = z.object({
    firstName: z.string(),

    lastName: z.string().optional(),

    email: z.string(),

    password: z.string(),

    language: langCodeEnum,
});

// Sign up form type
export type SignUpForm = z.infer<typeof signUpFormSchema>;
