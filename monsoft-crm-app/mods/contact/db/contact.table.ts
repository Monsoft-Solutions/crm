import { relations } from 'drizzle-orm';

import { defaultTimestamp, table, text } from '@db/sql';

import tables from '@db/db';

export const contact = table('contact', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => tables.brand.id, { onDelete: 'cascade' }),

    firstName: text('first_name').notNull(),

    lastName: text('last_name').notNull(),

    assistantId: text('assistant_id').references(() => tables.assistant.id, {
        onDelete: 'set null',
    }),

    createdAt: defaultTimestamp('created_at').notNull(),
});

export const contactTableRelations = relations(contact, ({ one, many }) => ({
    brand: one(tables.brand, {
        fields: [contact.brandId],
        references: [tables.brand.id],
    }),

    assistant: one(tables.assistant, {
        fields: [contact.assistantId],
        references: [tables.assistant.id],
    }),

    emailAddresses: many(tables.contactEmailAddress),

    phoneNumbers: many(tables.contactPhoneNumber),

    smsMessages: many(tables.contactSmsMessage),

    whatsappMessages: many(tables.contactWhatsappMessage),
}));
