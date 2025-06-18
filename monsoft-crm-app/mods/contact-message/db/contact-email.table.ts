import { relations } from 'drizzle-orm';
import { enumType, table, text, timestamp } from '@db/sql';

import { contactEmailAddress } from '@db/db';

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

    contactEmailAddressId: text('contact_email_address_id')
        .notNull()
        .references(() => contactEmailAddress.id, { onDelete: 'cascade' }),

    direction: contactEmailDirection('direction').notNull(),

    body: text('body').notNull(),

    status: contactEmailStatus('status').notNull().default('queued'),

    createdAt: timestamp('created_at').notNull(),
});

export const contactEmailRelations = relations(contactEmail, ({ one }) => ({
    contactEmailAddress: one(contactEmailAddress, {
        fields: [contactEmail.contactEmailAddressId],
        references: [contactEmailAddress.id],
    }),
}));
