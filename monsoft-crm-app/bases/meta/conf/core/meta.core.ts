import { text } from '@db/sql';

// meta custom configuration
export const metaCustomConf = {
    // whatsapp auth token
    whatsappToken: text('whatsapp_token').notNull(),

    // whatsapp from number
    whatsappFromPhoneId: text('whatsapp_from_phone_id').notNull(),
};
