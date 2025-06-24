import { relations } from 'drizzle-orm';
import { table, text, timestamp, enumType } from '@db/sql';

import { contact } from '@db/db';

import {
    contactMessageDirectionEnum,
    contactMessageStatusEnum,
} from '../enums';

export const contactWhatsappMessageDirection = enumType(
    'contact_whatsapp_message_direction',
    contactMessageDirectionEnum.options,
);

export const contactWhatsappMessageStatus = enumType(
    'contact_whatsapp_message_status',
    contactMessageStatusEnum.options,
);

export const contactWhatsappMessage = table('contact_whatsapp_message', {
    id: text('id').primaryKey(),

    sid: text('sid'),

    contactId: text('contact_id')
        .notNull()
        .references(() => contact.id, { onDelete: 'cascade' }),

    contactWhatsappNumber: text('contact_whatsapp_number').notNull(),

    direction: contactWhatsappMessageDirection('direction').notNull(),

    body: text('body').notNull(),

    status: contactWhatsappMessageStatus('status').notNull().default('queued'),

    createdAt: timestamp('created_at').notNull(),
});

export const contactWhatsappMessageRelations = relations(
    contactWhatsappMessage,

    ({ one }) => ({
        contact: one(contact, {
            fields: [contactWhatsappMessage.contactId],
            references: [contact.id],
        }),
    }),
);
