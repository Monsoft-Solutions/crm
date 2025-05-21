import { connectionEnvSchema, deploymentEnvSchema } from '@dist/env';

import { dbEnvSchema } from '@db/env';

export const localEnvSchema = connectionEnvSchema
    .merge(deploymentEnvSchema)
    .merge(dbEnvSchema);
