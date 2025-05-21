import { deploymentEnv } from '@env/constants/deployment-env.constant';

import { dbEnvSchema } from '../../env';

import { dbLocalConfig } from './db-local-config.constant';

import { rawEnv } from '@env/constants/raw-env.constant';

import { Dialect } from '@db/schemas';

import { dialect } from '@db/sql';

const { MSS_DEPLOYMENT_TYPE } = deploymentEnv;

const getDbConfig = () => {
    if (MSS_DEPLOYMENT_TYPE === 'production-preview') return dbLocalConfig;

    const {
        MSS_DATABASE_HOST,
        MSS_DATABASE_PORT,
        MSS_DATABASE_NAME,
        MSS_DATABASE_USER,
        MSS_DATABASE_PASS,
    } = dbEnvSchema.parse(rawEnv);

    // db connection details
    return {
        host: MSS_DATABASE_HOST,
        port: MSS_DATABASE_PORT,
        database: MSS_DATABASE_NAME,
        user: MSS_DATABASE_USER,
        password: MSS_DATABASE_PASS,
    };
};

const rawDbConfig = getDbConfig();

function addSsl<D extends Dialect>(config: typeof rawDbConfig, dialect: D) {
    type SSL = D extends 'postgresql' ? false : undefined;

    const ssl = (dialect === 'postgresql' && config.host === 'localhost'
        ? false
        : undefined) as unknown as SSL;

    return {
        ...config,
        ssl,
    };
}

export const dbConfig = addSsl(rawDbConfig, dialect);
