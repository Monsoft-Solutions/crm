import { relations } from 'drizzle-orm';
import { table, text } from '@db/sql';

import { brand } from '@db/db';

export const brandWhatsappNumber = table('brand_whatsapp_number', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => brand.id, { onDelete: 'cascade' }),

    phoneId: text('phone_id').notNull(),

    phoneNumber: text('phone_number').notNull(),
});

export const brandWhatsappNumberRelations = relations(
    brandWhatsappNumber,

    ({ one }) => ({
        brand: one(brand, {
            fields: [brandWhatsappNumber.brandId],
            references: [brand.id],
        }),
    }),
);
