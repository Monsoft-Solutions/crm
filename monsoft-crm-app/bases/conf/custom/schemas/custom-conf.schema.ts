import { createSelectSchema } from 'drizzle-zod';

import { table } from '@db/sql';

import { customConf } from '../constants';
import { z } from 'zod';

const auxTable = table('', {
    ...customConf,
});

export const customConfSchema = z.object({
    ...createSelectSchema(auxTable).shape,
});

export const customConfWithErrorSchema = z.union([
    z.object({
        data: customConfSchema,
        error: z.null(),
    }),
    z.object({
        data: z.undefined(),
        error: z.string(),
    }),
]);

export type CustomConf = typeof customConfSchema._type;
