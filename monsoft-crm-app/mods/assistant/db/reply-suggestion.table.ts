import { relations } from 'drizzle-orm';

import { table, text } from '@db/sql';

export const replySuggestion = table('reply_suggestion', {
    id: text('id').primaryKey(),

    messageId: text('message_id').notNull(),

    content: text('content').notNull(),
});

export const replySuggestionRelations = relations(replySuggestion, () => ({}));
