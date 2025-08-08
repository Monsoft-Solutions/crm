import { relations } from 'drizzle-orm';

import { enumType, table, text } from '@db/sql';

import { certaintyLevelEnum } from '../enums';

export const certaintyLevel = enumType(
    'certainty_level',
    certaintyLevelEnum.options,
);

export const replySuggestion = table('reply_suggestion', {
    id: text('id').primaryKey(),

    messageId: text('message_id').notNull(),

    content: text('content').notNull(),

    certaintyLevel: certaintyLevel('certainty_level').notNull(),
});

export const replySuggestionRelations = relations(replySuggestion, () => ({}));
