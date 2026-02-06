import { relations } from 'drizzle-orm';

import { defaultTimestamp, enumType, table, text, int } from '@db/sql';

import tables from '@db/db';

import { productStatusEnum } from '../enums';

export const productStatus = enumType(
    'product_status',
    productStatusEnum.options,
);

// product
export const product = table('product', {
    id: text('id').primaryKey(),

    // reference to brand
    brandId: text('brand_id')
        .notNull()
        .references(() => tables.brand.id),

    // product name
    name: text('name').notNull(),

    // product description
    description: text('description'),

    // unique SKU for inventory
    sku: text('sku').unique().notNull(),

    // product status
    status: productStatus('status').notNull().default('active'),

    // available quantity
    stock: int('stock').notNull().default(0),

    // product price
    price: int('price').notNull(),

    // creation timestamp
    createdAt: defaultTimestamp('created_at').notNull(),

    // update timestamp
    updatedAt: defaultTimestamp('updated_at').notNull(),
});

export const productRelations = relations(product, ({ one, many }) => ({
    brand: one(tables.brand, {
        fields: [product.brandId],
        references: [tables.brand.id],
    }),

    images: many(tables.productImage),
}));
