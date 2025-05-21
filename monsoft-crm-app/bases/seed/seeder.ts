import { drizzle } from '@db/sql';

import { dbConnectionWithName } from '@db/providers/server/db-connection.provider';

// drizzle client used for db clearing and seeding
export const seeder = drizzle(dbConnectionWithName);
