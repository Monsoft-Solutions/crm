import { relations } from 'drizzle-orm';
import { table, text } from '@db/sql';

import { brandDomain } from '@db/db';

export const brandEmailAddress = table('brand_email_address', {
    id: text('id').primaryKey(),

    brandDomainId: text('brand_domain_id')
        .notNull()
        .references(() => brandDomain.id, { onDelete: 'cascade' }),

    username: text('username').notNull(),
});

export const brandEmailAddressRelations = relations(
    brandEmailAddress,

    ({ one }) => ({
        domain: one(brandDomain, {
            fields: [brandEmailAddress.brandDomainId],
            references: [brandDomain.id],
        }),
    }),
);
