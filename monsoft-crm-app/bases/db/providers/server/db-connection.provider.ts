import { createPool, Pool } from '@db/sql';

import { dbConfig } from '@db/constants/dist/db-config.constant';

// db connection
// used for runtime ORM operations: insert, query, update, delete
// and management: drop, create, migrate, etc.
export const dbConnectionWithName: Pool = createPool(dbConfig);

export const dbConnectionWithoutName: Pool = createPool({
    ...dbConfig,
    database: undefined,
});
