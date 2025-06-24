import { relations } from 'drizzle-orm';
import { table, text } from '@db/sql';

import { brand, brandEmailAddress } from '@db/db';

export const brandDomain = table('brand_domain', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => brand.id, { onDelete: 'cascade' }),

    domain: text('domain').notNull(),
});

export const brandDomainRelations = relations(
    brandDomain,

    ({ one, many }) => ({
        brand: one(brand, {
            fields: [brandDomain.brandId],
            references: [brand.id],
        }),

        emails: many(brandEmailAddress),
    }),
);
