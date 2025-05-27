import { table, text, int } from '@db/sql';

import { brand } from '@db/db';

export const productTable = table('product', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => brand.id),

    name: text('name').notNull(),

    price: int('price').notNull(),
});
