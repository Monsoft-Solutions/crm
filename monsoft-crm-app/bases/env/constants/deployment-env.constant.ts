import { rawEnv } from './raw-env.constant';

import { deploymentEnvSchema } from '../../dist/env';

// deployment environment variables
export const deploymentEnv = deploymentEnvSchema.parse(rawEnv);
