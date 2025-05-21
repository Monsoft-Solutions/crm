import { drizzle, Database, Pool } from '@db/sql';

import { dbConnectionWithName } from './db-connection.provider';

import * as schema from '../../db.tables';

const config = {
    logger: false,
    mode: 'default',
} as const;

// drizzle db client
export const db: Database<typeof schema> & {
    $client: Pool;
} = drizzle(dbConnectionWithName, {
    schema,

    ...config,
});
