import { relations } from 'drizzle-orm';
import { unique } from 'drizzle-orm/pg-core';
import { enumType, table, text } from '@db/sql';

import { brand } from '@db/db';

import { isDefaultPhoneNumber } from '../../contact-channel/db/contact-phone-number.table';

export const whatsappSenderStatusEnum = enumType('whatsapp_sender_status', [
    'creating',
    'offline',
    'online',
]);

export const brandWhatsappNumber = table(
    'brand_whatsapp_number',

    {
        id: text('id').primaryKey(),

        brandId: text('brand_id')
            .notNull()
            .references(() => brand.id, { onDelete: 'cascade' }),

        phoneNumber: text('phone_number').notNull(),

        twilioSid: text('twilio_sid'),

        metaPhoneNumberId: text('meta_phone_number_id'),

        senderStatus: whatsappSenderStatusEnum('sender_status')
            .notNull()
            .default('offline'),

        isDefault: isDefaultPhoneNumber('is_default'),
    },

    (t) => [unique().on(t.brandId, t.isDefault)],
);

export const brandWhatsappNumberRelations = relations(
    brandWhatsappNumber,

    ({ one }) => ({
        brand: one(brand, {
            fields: [brandWhatsappNumber.brandId],
            references: [brand.id],
        }),
    }),
);
