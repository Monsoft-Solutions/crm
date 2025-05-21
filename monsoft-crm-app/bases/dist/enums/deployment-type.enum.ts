import { z } from 'zod';

export const deploymentType = z.enum([
    'production',
    'production-preview',
    'local',
]);

export type DeploymentType = z.infer<typeof deploymentType>;
