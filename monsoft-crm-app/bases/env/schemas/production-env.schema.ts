import { connectionEnvSchema, deploymentEnvSchema } from '@dist/env';

import { dbEnvSchema } from '@db/env';

export const productionEnvSchema = connectionEnvSchema
    .merge(deploymentEnvSchema)
    .merge(dbEnvSchema);
