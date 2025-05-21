import { z } from 'zod';

// connection environment schema
export const connectionEnvSchema = z.object({
    // fully qualified domain name of the application
    MSS_FQDN: z.string(),
});
