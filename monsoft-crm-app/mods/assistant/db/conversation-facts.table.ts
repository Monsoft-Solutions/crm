import { relations } from 'drizzle-orm';

import { table, text, timestamp, json } from '@db/sql';

import tables from '@db/db';

export const conversationFacts = table('conversation_facts', {
    id: text('id').primaryKey(),

    contactId: text('contact_id').notNull(),

    facts: json('facts').notNull(),

    createdAt: timestamp('created_at').notNull(),
});

export const conversationFactsRelations = relations(
    conversationFacts,

    ({ one }) => ({
        contact: one(tables.contact, {
            fields: [conversationFacts.contactId],
            references: [tables.contact.id],
        }),
    }),
);
