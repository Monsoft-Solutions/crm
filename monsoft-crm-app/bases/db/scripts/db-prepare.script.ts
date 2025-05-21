import { promisify } from 'util';
import { exec } from 'child_process';
import { exit } from 'process';

import { deploymentEnv } from '@env/constants/deployment-env.constant';

const { MSS_DEPLOYMENT_TYPE } = deploymentEnv;

const execAsync = promisify(exec);

async function updateDb() {
    try {
        console.log('Generating migrations...');
        await execAsync('npx drizzle-kit generate');

        console.log('Applying migrations...');
        await execAsync('npx drizzle-kit migrate');
    } catch (error) {
        console.error('failed to apply migrations:', error);
        exit(1);
    }
}

if (MSS_DEPLOYMENT_TYPE === 'production') {
    void updateDb();
}
