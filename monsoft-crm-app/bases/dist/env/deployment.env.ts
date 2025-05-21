import { z } from 'zod';

import { deploymentType } from '@dist/enums';

// deployment environment schema
export const deploymentEnvSchema = z.object({
    // the type of the deployment
    MSS_DEPLOYMENT_TYPE: deploymentType,
});
