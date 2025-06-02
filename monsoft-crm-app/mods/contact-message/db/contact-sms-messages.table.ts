import { relations } from 'drizzle-orm';
import { table, text, boolean } from '@db/sql';

import { contactPhoneNumber } from '@db/db';

export const contactSmsMessage = table('contact_sms_message', {
    id: text('id').primaryKey(),

    contactPhoneNumberId: text('contact_phone_number_id')
        .notNull()
        .references(() => contactPhoneNumber.id),

    body: text('body').notNull(),

    isRead: boolean('is_read').notNull().default(false),
});

export const contactSmsMessageRelations = relations(
    contactSmsMessage,
    ({ one }) => ({
        contactPhoneNumber: one(contactPhoneNumber, {
            fields: [contactSmsMessage.contactPhoneNumberId],
            references: [contactPhoneNumber.id],
        }),
    }),
);
