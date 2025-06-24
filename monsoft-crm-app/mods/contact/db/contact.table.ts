import { relations } from 'drizzle-orm';

import { table, text, timestamp } from '@db/sql';

import { brand, contactPhoneNumber, contactSmsMessage } from '@db/db';

export const contact = table('contact', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => brand.id, { onDelete: 'cascade' }),

    firstName: text('first_name').notNull(),

    lastName: text('last_name').notNull(),

    createdAt: timestamp('created_at').notNull(),
});

export const contactTableRelations = relations(contact, ({ one, many }) => ({
    brand: one(brand, {
        fields: [contact.brandId],
        references: [brand.id],
    }),

    phoneNumbers: many(contactPhoneNumber),

    smsMessages: many(contactSmsMessage),
}));
