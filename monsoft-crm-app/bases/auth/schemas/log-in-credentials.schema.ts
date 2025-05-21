import { z } from 'zod';

// Log in credentials schema
export const logInCredentialsSchema = z.object({
    email: z.string(),

    password: z.string(),
});

// Log in credentials type
export type LogInCredentials = z.infer<typeof logInCredentialsSchema>;
