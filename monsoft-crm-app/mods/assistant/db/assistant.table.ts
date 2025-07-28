import { relations } from 'drizzle-orm';

import { table, text, enumType } from '@db/sql';

import tables from '@db/db';

import { aiModelEnum } from '@ai/enums';

import { assistantTypeEnum } from '../enums';

export const assistantModel = enumType('assistant_model', aiModelEnum.options);

export const assistantType = enumType(
    'assistant_type',
    assistantTypeEnum.options,
);

export const assistant = table('assistant', {
    id: text('id').primaryKey(),

    brandId: text('brand_id')
        .notNull()
        .references(() => tables.brand.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),

    description: text('description').notNull(),

    model: assistantModel('model').notNull(),

    type: assistantType('type').notNull(),

    tone: text('tone').notNull(),

    instructions: text('instructions').notNull(),

    expertise: text('expertise').notNull(),
});

export const assistantRelations = relations(assistant, ({ one }) => ({
    brand: one(tables.brand, {
        fields: [assistant.brandId],
        references: [tables.brand.id],
    }),
}));
