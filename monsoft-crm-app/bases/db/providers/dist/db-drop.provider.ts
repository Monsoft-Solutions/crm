import { dbConfig } from '@db/constants/dist/db-config.constant';

import { dbConnectionWithoutName } from '@db/providers/server/db-connection.provider';

const dbName = dbConfig.database;

const sqlQuery = `DROP DATABASE IF EXISTS \`${dbName}\`;`;

// drop the database if exists
export async function dropDb(): Promise<void> {
    return new Promise((resolve, reject) => {
        dbConnectionWithoutName.query(sqlQuery, (err: Error | null) => {
            if (err) {
                console.error('Error dropping database:', err.message);
                reject(err);
            } else {
                console.log(`Database '${dbName}' dropped if existed.`);
                resolve();
            }
        });
    });
}
