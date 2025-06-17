import { z } from 'zod';

export const twilioEventTypeEnum = z.enum([
    'com.twilio.messaging.message.delivered',
    'com.twilio.messaging.message.sent',
    'com.twilio.messaging.inbound-message.received',
]);

export type TwilioEventType = z.infer<typeof twilioEventTypeEnum>;
