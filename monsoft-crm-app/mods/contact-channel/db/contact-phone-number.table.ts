import { relations } from 'drizzle-orm';
import { table, text } from '@db/sql';

import { contact, contactSmsMessage } from '@db/db';

export const contactPhoneNumber = table('contact_phone_number', {
    id: text('id').primaryKey(),

    contactId: text('contact_id')
        .notNull()
        .references(() => contact.id, { onDelete: 'cascade' }),

    phoneNumber: text('phone_number').notNull(),
});

export const contactPhoneNumberRelations = relations(
    contactPhoneNumber,
    ({ one, many }) => ({
        contact: one(contact, {
            fields: [contactPhoneNumber.contactId],
            references: [contact.id],
        }),

        contactSmsMessages: many(contactSmsMessage),
    }),
);
