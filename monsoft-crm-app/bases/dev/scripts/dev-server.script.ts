import { execSync } from 'child_process';

import { deploymentEnv } from '@env/constants/deployment-env.constant';

import { DefinedEnv } from '@env/schemas/defined-env.schema';

const { MSS_DEPLOYMENT_TYPE } = deploymentEnv;

const definedEnv: DefinedEnv = {
    MSS_DEPLOYMENT_TYPE,
    MSS_WEB_SOURCE: 'dev',
};

const definedJson = JSON.stringify(definedEnv);

const devServerCommand = `cross-env DEFINED='${definedJson}' tsx --watch ../../../bases/server/main.ts`;

execSync(devServerCommand, { stdio: 'inherit' });
