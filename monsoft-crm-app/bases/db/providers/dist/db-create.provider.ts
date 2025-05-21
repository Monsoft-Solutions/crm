import { dbConfig } from '@db/constants/dist/db-config.constant';

import { dbConnectionWithoutName } from '@db/providers/server/db-connection.provider';

const dbName = dbConfig.database;

const sqlQuery = `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`;

// create the database
export async function createDb(): Promise<void> {
    return new Promise((resolve, reject) => {
        dbConnectionWithoutName.query(sqlQuery, (err: Error | null) => {
            if (err) {
                console.error('Error creating database:', err.message);
                reject(err);
            } else {
                console.log(`Database '${dbName}' created or already existed.`);
                resolve();
            }
        });
    });
}
