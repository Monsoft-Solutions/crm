import { z } from 'zod';

import { deploymentEnvSchema } from '@dist/env';

export const definedEnvSchema = z
    .object({
        MSS_WEB_SOURCE: z.enum(['dev', 'bin']),
    })
    .merge(deploymentEnvSchema);

export type DefinedEnv = z.infer<typeof definedEnvSchema>;
