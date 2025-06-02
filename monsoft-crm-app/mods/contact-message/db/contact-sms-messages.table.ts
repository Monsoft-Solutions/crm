import { relations } from 'drizzle-orm';
import { table, text, timestamp, enumType } from '@db/sql';

import { contactPhoneNumber } from '@db/db';

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

    contactPhoneNumberId: text('contact_phone_number_id')
        .notNull()
        .references(() => contactPhoneNumber.id),

    direction: contactSmsMessageDirection('direction').notNull(),

    body: text('body').notNull(),

    status: contactSmsMessageStatus('status').notNull().default('queued'),

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
