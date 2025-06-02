import { relations } from 'drizzle-orm';

import { table, text, timestamp } from '@db/sql';

import { brand, contactPhoneNumber } from '@db/db';

export const contact = table('contact', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => brand.id),

    firstName: text('first_name').notNull(),

    lastName: text('last_name').notNull(),

    createdAt: timestamp('created_at').notNull(),
});

export const contactTableRelations = relations(contact, ({ many }) => ({
    contactPhoneNumbers: many(contactPhoneNumber),
}));
