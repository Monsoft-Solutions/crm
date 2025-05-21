// script used to initialize the local environment variables file (.env-cmdrc)

import fs from 'fs';

import { getEnvTemplate } from '@env/providers';

// -------------------------------------------------------------------------

// path to the environment variables file
const envCmdrcPath = '.env-cmdrc';

// name of the environment
const envName = 'local';

// environment variables template file content
const templateEnv = getEnvTemplate('local');

// -------------------------------------------------------------------------

// the environment variables file content
const env = {
    [envName]: templateEnv,
};

// write the environment variables file
fs.writeFileSync(envCmdrcPath, JSON.stringify(env, null, 4));
