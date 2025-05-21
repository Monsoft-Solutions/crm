import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

import { wait } from '@shared/utils/wait.util';

import { dbLocalConfig } from '@db/constants/dist/db-local-config.constant';

import { deploymentEnv } from '@env/constants/deployment-env.constant';

const execAsync = promisify(exec);

const { MSS_DEPLOYMENT_TYPE } = deploymentEnv;

// prerequisites for installing MySQL Server
const dependencies = [
    'wget',
    'gnupg',
    'ca-certificates',
    'lsb-release',
    'apt-transport-https',
    'curl',
    'libaio1',
    'libmecab2',
    'libncurses6',
    'libstdc++6',
    'libssl3',
    'libtinfo6',
];

// MySQL Server packages
const mysqlServerPackages: { src: string; tmp: string }[] = [
    {
        src: 'https://repo.mysql.com/apt/debian/pool/mysql-8.0/m/mysql-community/mysql-common_8.0.40-1debian12_amd64.deb',
        tmp: '/tmp/mysql-common.deb',
    },
    {
        src: 'https://repo.mysql.com/apt/debian/pool/mysql-8.0/m/mysql-community/mysql-community-client-plugins_8.0.40-1debian12_amd64.deb',
        tmp: '/tmp/mysql-community-client-plugins.deb',
    },
    {
        src: 'https://repo.mysql.com/apt/debian/pool/mysql-8.0/m/mysql-community/mysql-community-client-core_8.0.40-1debian12_amd64.deb',
        tmp: '/tmp/mysql-community-client-core.deb',
    },
    {
        src: 'https://repo.mysql.com/apt/debian/pool/mysql-8.0/m/mysql-community/mysql-community-client_8.0.40-1debian12_amd64.deb',
        tmp: '/tmp/mysql-community-client.deb',
    },
    {
        src: 'https://repo.mysql.com/apt/debian/pool/mysql-8.0/m/mysql-community/mysql-community-server-core_8.0.40-1debian12_amd64.deb',
        tmp: '/tmp/mysql-community-server-core.deb',
    },
    {
        src: 'https://repo.mysql.com/apt/debian/pool/mysql-8.0/m/mysql-community/mysql-community-server-core-dbgsym_8.0.40-1debian12_amd64.deb',
        tmp: '/tmp/mysql-community-server-core-dbgsym.deb',
    },
];

const mysqlDataDirectory = '/var/lib/mysql';
const mysqlFilesDirectory = '/var/lib/mysql-files';
const mysqlDaemonDirectory = '/var/run/mysqld';

const mysqlDirectories = [
    mysqlDataDirectory,
    mysqlFilesDirectory,
    mysqlDaemonDirectory,
];

const mysqlUser = 'mysql';
const mysqlGroup = 'mysql';

const { host, user, password } = dbLocalConfig;

async function installMySQLServer() {
    try {
        console.log('Updating package lists...');
        await execAsync('apt-get update');

        console.log('Installing prerequisites...');
        await execAsync(`apt-get install -y ${dependencies.join(' ')}`);

        console.log('Removing package lists...');
        await execAsync('rm -rf /var/lib/apt/lists/*');

        console.log('Downloading MySQL Server packages...');
        await execAsync(
            mysqlServerPackages
                .map((pkg) => `wget -q ${pkg.src} -O ${pkg.tmp}`)
                .join(' && '),
        );

        console.log('Installing MySQL Server packages...');
        await execAsync(
            mysqlServerPackages.map((pkg) => `dpkg -i ${pkg.tmp}`).join(' && '),
        );

        console.log('Removing MySQL Server packages...');
        await execAsync(
            mysqlServerPackages.map((pkg) => `rm -f ${pkg.tmp}`).join(' && '),
        );

        console.log('Creating MySQL group...');
        await execAsync(`groupadd -r ${mysqlGroup}`);

        console.log('Creating MySQL user...');
        await execAsync(`useradd -r -g ${mysqlGroup} ${mysqlUser}`);

        console.log('Creating MySQL directories...');
        await execAsync(`mkdir -p ${mysqlDirectories.join(' ')}`);

        console.log('Setting ownership for MySQL directories...');
        await execAsync(
            `chown -R ${mysqlUser}:${mysqlGroup} ${mysqlDirectories.join(' ')}`,
        );

        console.log('Setting permissions for MySQL directories...');
        await execAsync(`chmod 755 ${mysqlDirectories.join(' ')}`);

        console.log('Initializing MySQL data directory...');
        await execAsync(
            `mysqld --initialize-insecure --user=${mysqlUser} --datadir=${mysqlDataDirectory}`,
        );
    } catch (error) {
        console.error('Error installing MySQL Server:', error);
        throw error;
    }
}

// start MySQL Server
async function startMySQLServer() {
    try {
        console.log('Starting MySQL Server...');
        await execAsync('npm run db:start');
    } catch (error) {
        console.error('Error starting MySQL Server:', error);
        throw error;
    }
}

// prepare the database
async function prepareDb() {
    let isMySQLServerReady = false;

    while (!isMySQLServerReady) {
        try {
            await execAsync('mysqladmin ping --silent');
            isMySQLServerReady = true;
        } catch {
            await wait(1000);
        }
    }

    // wait for the server to be fully available
    await wait(5000);

    console.log('Creating database user...');
    await execAsync(
        `mysql -e "CREATE USER '${user}'@'${host}' IDENTIFIED BY '${password}';"`,
    );

    console.log('Granting privileges to database user...');
    await execAsync(
        `mysql -e "GRANT ALL PRIVILEGES ON *.* TO '${user}'@'${host}' WITH GRANT OPTION;"`,
    );

    console.log('Flushing privileges...');
    await execAsync('mysql -e "FLUSH PRIVILEGES;"');

    await import('@db/providers/dist/db-create.provider').then(
        async ({ createDb }) => {
            console.log('Creating database...');
            await createDb();
        },
    );

    console.log('Generating migrations...');
    await execAsync('npx drizzle-kit generate');

    console.log('Applying migrations...');
    await execAsync('npx drizzle-kit migrate');

    console.log('Seeding database...');
    await execAsync('npm run db:seed');

    console.log('Database setup complete !');
}

async function main() {
    if (MSS_DEPLOYMENT_TYPE === 'production') {
        console.log(
            'Production deployment detected, skipping database setup...',
        );

        return;
    }

    if (MSS_DEPLOYMENT_TYPE === 'local') {
        console.log('Local deployment detected, skipping database setup...');

        return;
    }

    {
        console.log(
            'Remote preview deployment detected, setting up database...',
        );

        const dbAlreadyInitialized = await fs
            .access(mysqlDataDirectory)
            .then(() => true)
            .catch(() => false);

        if (!dbAlreadyInitialized) await installMySQLServer();

        void startMySQLServer();

        if (!dbAlreadyInitialized) void prepareDb();
    }
}

void main();
