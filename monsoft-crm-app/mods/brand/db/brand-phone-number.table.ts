import { relations } from 'drizzle-orm';
import { unique } from 'drizzle-orm/pg-core';
import { table, text } from '@db/sql';

import { brand } from '@db/db';

import { isDefaultPhoneNumber } from '../../contact-channel/db/contact-phone-number.table';

export const brandPhoneNumber = table(
    'brand_phone_number',

    {
        id: text('id').primaryKey(),

        brandId: text('brand_id')
            .notNull()
            .references(() => brand.id, { onDelete: 'cascade' }),

        phoneNumber: text('phone_number').notNull(),

        isDefault: isDefaultPhoneNumber('is_default'),
    },

    (t) => [unique().on(t.brandId, t.isDefault)],
);

export const brandPhoneNumberRelations = relations(
    brandPhoneNumber,

    ({ one }) => ({
        brand: one(brand, {
            fields: [brandPhoneNumber.brandId],
            references: [brand.id],
        }),
    }),
);
