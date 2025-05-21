import { defineConfig } from 'drizzle-kit';

import { dbConfig } from './constants/dist/db-config.constant';

import { dialect } from './sql';

const out = `drizzle/${dialect}`;

export default defineConfig({
    dbCredentials: dbConfig,

    // file exporting the full db schema
    schema: 'bases/db/db.tables.ts',

    // migrations directory
    out,

    dialect,
    tablesFilter: ['!federated_*'],

    // Always ask for confirmation
    strict: true,
});
