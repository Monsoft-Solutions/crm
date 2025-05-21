import { seeder } from '@seed/seeder';

import { seed } from 'drizzle-seed';

// type of a db seed
export type Seed<Schema extends Record<string, unknown>> = Parameters<
    ReturnType<typeof seed<typeof seeder, Schema>>['refine']
>[0];
