import { table, text } from '@db/sql';

import { organization } from '@db/db.tables';

export const brandTable = table('brand', {
    id: text('id').primaryKey(),

    organizationId: text('organization_id')
        .notNull()
        .references(() => organization.id),

    name: text('name').notNull(),
});
