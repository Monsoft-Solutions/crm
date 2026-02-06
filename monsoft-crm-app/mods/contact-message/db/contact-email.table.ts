import { relations } from 'drizzle-orm';
import { defaultTimestamp, enumType, table, text } from '@db/sql';

import { contact } from '@db/db';

import {
    contactMessageDirectionEnum,
    contactMessageStatusEnum,
} from '../enums';

export const contactEmailDirection = enumType(
    'contact_email_direction',
    contactMessageDirectionEnum.options,
);

export const contactEmailStatus = enumType(
    'contact_email_status',
    contactMessageStatusEnum.options,
);

export const contactEmail = table('contact_email', {
    id: text('id').primaryKey(),

    sid: text('sid'),

    contactId: text('contact_id')
        .notNull()
        .references(() => contact.id, { onDelete: 'cascade' }),

    contactEmailAddress: text('contact_email_address').notNull(),

    direction: contactEmailDirection('direction').notNull(),

    body: text('body').notNull(),

    status: contactEmailStatus('status').notNull().default('queued'),

    createdAt: defaultTimestamp('created_at').notNull(),
});

export const contactEmailRelations = relations(
    contactEmail,

    ({ one }) => ({
        contact: one(contact, {
            fields: [contactEmail.contactId],
            references: [contact.id],
        }),
    }),
);
