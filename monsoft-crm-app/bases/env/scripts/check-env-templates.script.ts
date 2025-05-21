// script used to check that the template environment variables files
// are valid and do not contain any unnecessary variables

// ------------------------------------------------------------------------------------------------

import { z } from 'zod';

import { productionEnvSchema } from '@env/schemas/production-env.schema';

import { getEnvTemplate } from '@env/providers';

import { DeploymentType } from '@dist/enums';
import { productionPreviewEnvSchema } from '@env/schemas/production-preview-env.schema';
import { localEnvSchema } from '@env/schemas/local-env.schema';

const templateSchemaPairs: [DeploymentType, z.ZodObject<z.ZodRawShape>][] = [
    ['production', productionEnvSchema],
    ['production-preview', productionPreviewEnvSchema],
    ['local', localEnvSchema],
];

templateSchemaPairs.forEach(([deploymentType, schema]) => {
    const templateEnv = getEnvTemplate(deploymentType);

    // get all required environment variable names
    const fullEnvKeys = Object.keys(schema.shape);

    // get all variable names present in the template environment file
    const templateEnvKeys = Object.keys(templateEnv);

    // get all unnecessary variables
    // (present in the template, but not required by the schemas)
    const unnecessaryEnvVars = templateEnvKeys.filter(
        (key) => !fullEnvKeys.includes(key),
    );

    // if there are any unnecessary variables
    // print an error message and exit with error code
    if (unnecessaryEnvVars.length > 0) {
        console.error(
            `Unnecessary environment variables found in ${deploymentType} template, please remove them for consistency:`,
            unnecessaryEnvVars,
        );

        process.exit(1);
    }

    // check if the template values are valid
    const parsingResult = schema.safeParse(templateEnv);

    // if the template values are not valid
    // print the error message and exit with error code
    if (!parsingResult.success) {
        console.error(
            `Invalid environment variables found in ${deploymentType} template:`,
            parsingResult.error,
        );

        process.exit(1);
    }
});
