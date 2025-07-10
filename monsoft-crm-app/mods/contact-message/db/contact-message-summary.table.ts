import { relations } from 'drizzle-orm';
import { table, text, timestamp } from '@db/sql';

import tables from '@db/db';

export const contactMessageSummary = table('contact_message_summary', {
    id: text('id').primaryKey(),

    contactId: text('contact_id')
        .notNull()
        .references(() => tables.contact.id, { onDelete: 'cascade' }),

    summary: text('summary').notNull(),

    from: timestamp('from').notNull(),

    to: timestamp('to').notNull(),
});

export const contactMessageSummaryRelations = relations(
    contactMessageSummary,

    ({ one }) => ({
        contact: one(tables.contact, {
            fields: [contactMessageSummary.contactId],
            references: [tables.contact.id],
        }),
    }),
);
