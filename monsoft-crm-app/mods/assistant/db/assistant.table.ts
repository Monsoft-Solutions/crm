import { relations } from 'drizzle-orm';

import { table, text, enumType } from '@db/sql';

import tables from '@db/db';

import { assistantToneEnum } from '../enums';

import { aiModelEnum } from '@ai/enums';

export const assistantModel = enumType('assistant_model', aiModelEnum.options);

export const assistantTone = enumType(
    'assistant_tone',
    assistantToneEnum.options,
);

export const assistant = table('assistant', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => tables.brand.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),

    model: assistantModel('model').notNull(),

    tone: assistantTone('tone').notNull(),

    instructions: text('instructions').notNull(),
});

export const assistantRelations = relations(assistant, ({ one }) => ({
    brand: one(tables.brand, {
        fields: [assistant.brandId],
        references: [tables.brand.id],
    }),
}));
