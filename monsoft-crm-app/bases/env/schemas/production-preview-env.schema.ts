import { connectionEnvSchema, deploymentEnvSchema } from '@dist/env';

export const productionPreviewEnvSchema =
    connectionEnvSchema.merge(deploymentEnvSchema);
