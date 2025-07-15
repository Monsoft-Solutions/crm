import { relations } from 'drizzle-orm';

import { table, text } from '@db/sql';

import tables from '@db/db';

export const conversationFacts = table('conversation_facts', {
    id: text('id').primaryKey(),

    contactId: text('contact_id').notNull(),
});

export const conversationFactsRelations = relations(
    conversationFacts,

    ({ one, many }) => ({
        contact: one(tables.contact, {
            fields: [conversationFacts.contactId],
            references: [tables.contact.id],
        }),

        topicsDiscussed: many(tables.topicDiscussed),
    }),
);
