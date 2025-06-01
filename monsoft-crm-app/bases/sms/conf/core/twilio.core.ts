import { text } from '@db/sql';

// twilio core configuration
export const twilioCoreConf = {
    // twilio sid key
    twilioSid: text('twilio_sid').notNull(),

    // twilio auth token
    twilioToken: text('twilio_token').notNull(),

    // twilio from number
    twilioFrom: text('twilio_from').notNull(),
};
