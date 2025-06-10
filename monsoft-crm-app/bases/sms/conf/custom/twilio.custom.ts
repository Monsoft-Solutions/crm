import { text } from '@db/sql';

// twilio custom configuration
export const twilioCustomConf = {
    // twilio sid key
    twilioSid: text('twilio_sid'),

    // twilio auth token
    twilioToken: text('twilio_token'),
};
