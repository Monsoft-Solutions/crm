import { relations } from 'drizzle-orm';
import { table, text } from '@db/sql';

import { brandPhoneNumber, organization } from '@db/db';

export const brand = table('brand', {
    id: text('id').primaryKey(),

    organizationId: text('organization_id')
        .notNull()
        .references(() => organization.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),

    domain: text('domain').notNull(),
});

export const brandRelations = relations(
    brand,

    ({ many }) => ({
        phoneNumbers: many(brandPhoneNumber),
    }),
);
