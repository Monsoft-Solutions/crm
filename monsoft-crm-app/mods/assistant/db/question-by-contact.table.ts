import { relations } from 'drizzle-orm';

import { table, text } from '@db/sql';

import tables from '@db/db';

export const questionByContact = table('question_by_contact', {
    id: text('id').primaryKey(),

    conversationFactsId: text('conversation_facts_id')
        .references(() => tables.conversationFacts.id, { onDelete: 'cascade' })
        .notNull(),

    question: text('question').notNull(),
});

export const questionByContactRelations = relations(
    questionByContact,

    ({ one }) => ({
        conversationFacts: one(tables.conversationFacts, {
            fields: [questionByContact.conversationFactsId],
            references: [tables.conversationFacts.id],
        }),
    }),
);
