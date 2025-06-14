import { relations } from 'drizzle-orm';
import { table, text } from '@db/sql';

import { contactEmailAddress } from '@db/db';

export const contactEmail = table('contact_email', {
    id: text('id').primaryKey(),

    contactEmailAddressId: text('contact_email_address_id')
        .notNull()
        .references(() => contactEmailAddress.id, { onDelete: 'cascade' }),

    body: text('body').notNull(),
});

export const contactEmailRelations = relations(contactEmail, ({ one }) => ({
    contactEmailAddress: one(contactEmailAddress, {
        fields: [contactEmail.contactEmailAddressId],
        references: [contactEmailAddress.id],
    }),
}));
