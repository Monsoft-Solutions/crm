import { relations } from 'drizzle-orm';
import { index } from 'drizzle-orm/pg-core';
import { defaultTimestamp, table, text, enumType } from '@db/sql';

import { contact } from '@db/db';

import {
    contactMessageDirectionEnum,
    contactMessageStatusEnum,
} from '../enums';

import { contactChannelTypeEnum } from '@mods/contact-channel/enums';

export const contactMessageChannel = enumType(
    'contact_message_channel',
    contactChannelTypeEnum.options,
);

export const contactMessageDirection = enumType(
    'contact_message_direction',
    contactMessageDirectionEnum.options,
);

export const contactMessageStatus = enumType(
    'contact_message_status',
    contactMessageStatusEnum.options,
);

export const contactMessage = table(
    'contact_message',

    {
        id: text('id').primaryKey(),

        externalId: text('external_id'),

        contactId: text('contact_id')
            .notNull()
            .references(() => contact.id, { onDelete: 'cascade' }),

        channel: contactMessageChannel('channel').notNull(),

        fromAddress: text('from_address').notNull(),

        toAddress: text('to_address').notNull(),

        direction: contactMessageDirection('direction').notNull(),

        subject: text('subject'),

        body: text('body').notNull(),

        status: contactMessageStatus('status').notNull().default('queued'),

        createdAt: defaultTimestamp('created_at').notNull(),
    },

    (t) => [
        index('contact_message_contact_created_idx').on(
            t.contactId,
            t.createdAt,
        ),
        index('contact_message_external_id_idx').on(t.externalId),
        index('contact_message_contact_direction_status_idx').on(
            t.contactId,
            t.direction,
            t.status,
        ),
    ],
);

export const contactMessageRelations = relations(contactMessage, ({ one }) => ({
    contact: one(contact, {
        fields: [contactMessage.contactId],
        references: [contact.id],
    }),
}));
