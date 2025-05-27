import { reset } from 'drizzle-seed';

import { seeder } from './seeder';

import * as schema from '@db/db';

// function used to clear the db
export async function resetDb() {
    console.log('Resetting DB');

    await reset(seeder, schema);

    console.log('DB reset !');
}
