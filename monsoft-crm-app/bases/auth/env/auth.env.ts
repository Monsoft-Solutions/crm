import { z } from 'zod';

// auth environment schema
export const authEnvSchema = z.object({
    MSS_AUTH_SECRET: z.string(),
    MSS_GOOGLE_ID: z.string(),
    MSS_GOOGLE_SECRET: z.string(),
});
