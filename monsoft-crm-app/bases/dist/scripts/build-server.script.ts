import { build } from 'esbuild';

import { DefinedEnv } from '@env/schemas/defined-env.schema';

import { deploymentEnv } from '@env/constants/deployment-env.constant';

const { MSS_DEPLOYMENT_TYPE } = deploymentEnv;

const definedEnv: DefinedEnv = {
    MSS_WEB_SOURCE: 'bin',
    MSS_DEPLOYMENT_TYPE,
};

const define = {
    'process.env.DEFINED': JSON.stringify(definedEnv),
};

const options: Parameters<typeof build>[0] = {
    entryPoints: ['../../server/main.ts'],
    outfile: '../../../bin/server/main.js',
    logLevel: 'error',
    platform: 'node',
    bundle: true,
    minify: true,
    define,
};

build(options).catch(() => process.exit(1));
