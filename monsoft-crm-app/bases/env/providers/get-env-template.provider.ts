import fs from 'fs';

import { z } from 'zod';

import { DeploymentType } from '@dist/enums';

export function getEnvTemplate(deploymentType: DeploymentType) {
    // path to the environment variables template file
    const envTemplatePath = `bases/env/templates/${deploymentType}.template`;

    // read the environment variables template file
    const envTemplateFileContent = fs.readFileSync(envTemplatePath, 'utf-8');

    // split the file content into lines
    const linesWithComments = envTemplateFileContent.split('\n');

    // remove comments, trim whitespace, and filter out empty lines
    const lines = linesWithComments
        .map((line) => line.split('#').at(0)?.trim())
        .filter((line) => line !== undefined)
        .filter((line) => line.length > 0);

    // map each line to a key-value pair
    const pairs = lines
        .map((line) => {
            const words = line.split('=');

            if (words.length !== 2) return undefined;

            const key = words.at(0);
            const valueStr = words.at(1);

            if (key === undefined || valueStr === undefined) return undefined;

            const valueNumberParse = z.coerce.number().safeParse(valueStr);

            const value = valueNumberParse.success
                ? valueNumberParse.data
                : valueStr;

            return {
                key,
                value,
            };
        })
        .filter((pair) => pair !== undefined);

    // create an environment object from the key-value pairs
    const templateEnv = Object.fromEntries(
        pairs.map((pair) => [pair.key, pair.value]),
    );

    return templateEnv;
}
