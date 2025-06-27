import { relations } from 'drizzle-orm';
import { table, text } from '@db/sql';

import {
    organization,
    brandDomain,
    brandPhoneNumber,
    brandWhatsappNumber,
} from '@db/db';

export const brand = table('brand', {
    id: text('id').primaryKey(),

    organizationId: text('organization_id')
        .notNull()
        .references(() => organization.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),
});

export const brandRelations = relations(
    brand,

    ({ many }) => ({
        phoneNumbers: many(brandPhoneNumber),

        whatsappNumbers: many(brandWhatsappNumber),

        domains: many(brandDomain),
    }),
);
