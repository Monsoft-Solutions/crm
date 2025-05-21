import { z } from 'zod';

import { createSelectSchema } from 'drizzle-zod';

import { table } from '@db/sql';

import { coreConf } from '../constants';

// Auxiliary table (not used in db) containing all core configurations
const auxTable = table('core_conf', {
    ...coreConf,
});

// Core configuration schema
export const coreConfSchema = z.object({
    ...createSelectSchema(auxTable).shape,
});

export const coreConfWithErrorSchema = z.union([
    z.object({
        data: coreConfSchema,
        error: z.null(),
    }),
    z.object({
        data: z.undefined(),
        error: z.string(),
    }),
]);

// Core configuration type
export type CoreConf = z.infer<typeof coreConfSchema>;
