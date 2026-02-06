import { relations } from 'drizzle-orm';
import { defaultTimestamp, table, text, enumType } from '@db/sql';

import { contact } from '@db/db';

import {
    contactMessageDirectionEnum,
    contactMessageStatusEnum,
} from '../enums';

export const contactSmsMessageDirection = enumType(
    'contact_sms_message_direction',
    contactMessageDirectionEnum.options,
);

export const contactSmsMessageStatus = enumType(
    'contact_sms_message_status',
    contactMessageStatusEnum.options,
);

export const contactSmsMessage = table('contact_sms_message', {
    id: text('id').primaryKey(),

    sid: text('sid'),

    contactId: text('contact_id')
        .notNull()
        .references(() => contact.id, { onDelete: 'cascade' }),

    contactPhoneNumber: text('contact_phone_number').notNull(),

    direction: contactSmsMessageDirection('direction').notNull(),

    body: text('body').notNull(),

    status: contactSmsMessageStatus('status').notNull().default('queued'),

    createdAt: defaultTimestamp('created_at').notNull(),
});

export const contactSmsMessageRelations = relations(
    contactSmsMessage,
    ({ one }) => ({
        contact: one(contact, {
            fields: [contactSmsMessage.contactId],
            references: [contact.id],
        }),
    }),
);
