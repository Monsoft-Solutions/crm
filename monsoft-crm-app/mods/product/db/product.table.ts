import { table, text, int } from '@db/sql';

import { brandTable } from '@db/db.tables';

export const productTable = table('product', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => brandTable.id),

    name: text('name').notNull(),

    price: int('price').notNull(),
});
