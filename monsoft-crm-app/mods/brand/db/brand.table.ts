import { relations } from 'drizzle-orm';
import { table, text } from '@db/sql';

import tables from '@db/db';

export const brand = table('brand', {
    id: text('id').primaryKey(),

    organizationId: text('organization_id')
        .notNull()
        .references(() => tables.organization.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),
});

export const brandRelations = relations(
    brand,

    ({ many }) => ({
        phoneNumbers: many(tables.brandPhoneNumber),

        whatsappNumbers: many(tables.brandWhatsappNumber),

        domains: many(tables.brandDomain),

        contacts: many(tables.contact),
    }),
);
