import { char, enumType, sqlEnum, table, varchar } from '@db/sql';

import { usageSchema } from '../../schemas';

import { coreConf } from '../constants';

export const coreConfUsageEnum = enumType(
    'core_conf_usage',
    usageSchema.options,
);

// Core configuration table
export const coreConfTable = table('core_conf', {
    id: char('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).unique().notNull(),
    usage: sqlEnum('usage', coreConfUsageEnum).unique(),

    ...coreConf,
});
