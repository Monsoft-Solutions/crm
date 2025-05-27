import { table, text } from '@db/sql';

import { brandTable } from '@db/db.tables';

export const contactTable = table('contact', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => brandTable.id),

    firstName: text('first_name').notNull(),

    lastName: text('last_name').notNull(),
});
