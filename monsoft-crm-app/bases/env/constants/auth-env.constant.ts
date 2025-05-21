import { rawEnv } from './raw-env.constant';

import { authEnvSchema } from '../../auth/env';

// auth environment variables
export const authEnv = authEnvSchema.parse(rawEnv);
