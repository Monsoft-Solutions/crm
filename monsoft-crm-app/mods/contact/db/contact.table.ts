import { table, text } from '@db/sql';

import { brand } from '@db/db';

export const contact = table('contact', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => brand.id),

    firstName: text('first_name').notNull(),

    lastName: text('last_name').notNull(),
});
