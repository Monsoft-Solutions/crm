import { varchar } from '@db/sql';

// anthropic core configuration
export const anthropicCoreConf = {
    anthropicApiKey: varchar('anthropic_api_key', { length: 255 }).notNull(),
};
