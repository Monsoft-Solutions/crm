import { rawEnv } from './raw-env.constant';

import { connectionEnvSchema } from '../../dist/env';

// connection environment variables
export const connectionEnv = connectionEnvSchema.parse(rawEnv);
