import { relations } from 'drizzle-orm';

import { table, text, enumType } from '@db/sql';

import { detailLevelEnum } from '../enums';

export const detailLevel = enumType('detail_level', detailLevelEnum.options);

export const assistantBehavior = table('assistant_behavior', {
    id: text('id').primaryKey(),

    communicationStyle: text('communication_style').notNull(),

    responseTone: text('response_tone').notNull(),

    detailLevel: detailLevel('detail_level').notNull(),
});

export const assistantBehaviorRelations = relations(
    assistantBehavior,

    () => ({}),
);
