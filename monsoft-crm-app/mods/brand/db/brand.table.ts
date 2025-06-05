import { table, text } from '@db/sql';

import { organization } from '@db/db';

export const brand = table('brand', {
    id: text('id').primaryKey(),

    organizationId: text('organization_id')
        .notNull()
        .references(() => organization.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),
});
