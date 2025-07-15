import { relations } from 'drizzle-orm';

import { table, text } from '@db/sql';

import tables from '@db/db';

export const topicDiscussed = table('topic_discussed', {
    id: text('id').primaryKey(),

    conversationFactsId: text('conversation_facts_id')
        .references(() => tables.conversationFacts.id, { onDelete: 'cascade' })
        .notNull(),

    topic: text('topic').notNull(),
});

export const topicDiscussedRelations = relations(
    topicDiscussed,

    ({ one }) => ({
        conversationFacts: one(tables.conversationFacts, {
            fields: [topicDiscussed.conversationFactsId],
            references: [tables.conversationFacts.id],
        }),
    }),
);
