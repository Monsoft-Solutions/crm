import { text } from '@db/sql';

// openai core configuration
export const openaiCoreConf = {
    openaiApiKey: text('openai_api_key').notNull(),
};
