import { relations } from 'drizzle-orm';
import { unique } from 'drizzle-orm/pg-core';

import { table, text, timestamp, enumType } from '@db/sql';

import tables from '@db/db';

export const isMainProductImage = enumType('is_main_product_image', ['true']);

// product-image
export const productImage = table(
    'product_image',

    {
        id: text('id').primaryKey(),

        // reference to product
        productId: text('product_id')
            .notNull()
            .references(() => tables.product.id, {
                onDelete: 'cascade',
            }),

        // image url
        imageUrl: text('image_url').notNull(),

        // flag for main product image
        isMain: isMainProductImage('is_main'),

        // creation timestamp
        createdAt: timestamp('created_at').notNull(),
    },

    (t) => [unique().on(t.productId, t.isMain)],
);

export const productImageRelations = relations(
    productImage,

    ({ one }) => ({
        product: one(tables.product, {
            fields: [productImage.productId],
            references: [tables.product.id],
        }),
    }),
);
