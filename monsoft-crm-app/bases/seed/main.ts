// import { resetDb } from './reset-db';

import { seedDb } from './seed-db';

// script used to seed the db with test data
async function main() {
    // clear the db
    // await resetDb();

    // seed the db
    await seedDb();

    // exit the process with a success code
    process.exit(0);
}

void main();
