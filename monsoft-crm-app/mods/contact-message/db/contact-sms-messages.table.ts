import { relations } from 'drizzle-orm';
import { table, text, boolean, timestamp, enumType } from '@db/sql';

import { contactPhoneNumber } from '@db/db';

import { contactSmsMessageDirectionEnum } from '../enums';

export const contactSmsMessageDirection = enumType(
    'contact_sms_message_direction',
    contactSmsMessageDirectionEnum.options,
);

export const contactSmsMessage = table('contact_sms_message', {
    id: text('id').primaryKey(),

    contactPhoneNumberId: text('contact_phone_number_id')
        .notNull()
        .references(() => contactPhoneNumber.id),

    direction: contactSmsMessageDirection('direction').notNull(),

    body: text('body').notNull(),

    isRead: boolean('is_read').notNull().default(false),

    createdAt: timestamp('created_at').notNull(),
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
