import { varchar } from '@db/sql';

// langfuse core configuration
export const langfuseCoreConf = {
    langfuseBaseUrl: varchar('langfuse_base_url', { length: 500 }).notNull(),

    langfusePublicKey: varchar('langfuse_public_key', {
        length: 255,
    }).notNull(),

    langfuseSecretKey: varchar('langfuse_secret_key', {
        length: 255,
    }).notNull(),
};
