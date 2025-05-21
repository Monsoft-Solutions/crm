import { char, enumType, sqlEnum, table, varchar } from '@db/sql';

import { usageSchema } from '../../schemas';

import { appCustomConf } from '../constants';
import { organization } from '@auth/db';

export const customConfUsageEnum = enumType(
    'custom_conf_usage',
    usageSchema.options,
);

export const customConfTable = table('custom_conf', {
    id: char('id', { length: 36 }).primaryKey(),
    organizationId: char('organization_id', { length: 36 })
        .notNull()
        .references(() => organization.id),
    name: varchar('name', { length: 255 }).unique().notNull(),
    usage: sqlEnum('usage', customConfUsageEnum).unique(),

    ...appCustomConf,
});
