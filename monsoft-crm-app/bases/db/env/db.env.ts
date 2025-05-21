import { z } from 'zod';

// db server env schema, to be used server side
export const dbEnvSchema = z.object({
    MSS_DATABASE_HOST: z.string().min(1),
    MSS_DATABASE_PORT: z.coerce.number(),
    MSS_DATABASE_NAME: z.string().min(1),

    MSS_DATABASE_USER: z.string().min(1),
    MSS_DATABASE_PASS: z.string().min(1),
});
