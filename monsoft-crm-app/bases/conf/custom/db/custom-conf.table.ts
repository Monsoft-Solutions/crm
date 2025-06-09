import { char, table } from '@db/sql';

import { customConf } from '../constants';
import { organization } from '@auth/db';

export const customConfTable = table('custom_conf', {
    id: char('id', { length: 36 }).primaryKey(),

    organizationId: char('organization_id', { length: 36 })
        .notNull()
        .unique()
        .references(() => organization.id),

    ...customConf,
});
