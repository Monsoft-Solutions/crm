import { relations } from 'drizzle-orm';
import { table, text } from '@db/sql';

import { brand } from '@db/db';

export const brandPhoneNumber = table('brand_phone_number', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => brand.id, { onDelete: 'cascade' }),

    phoneNumber: text('phone_number').notNull(),
});

export const brandPhoneNumberRelations = relations(
    brandPhoneNumber,

    ({ one }) => ({
        brand: one(brand, {
            fields: [brandPhoneNumber.brandId],
            references: [brand.id],
        }),
    }),
);
