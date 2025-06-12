import { z } from 'zod';

import { TwilioEventType } from '@sms/enums';

const twilioEventSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal(
            'com.twilio.messaging.inbound-message.received' satisfies TwilioEventType,
        ),

        data: z.object({
            messageSid: z.string(),
            from: z.string(),
            body: z.string(),
        }),
    }),

    z.object({
        type: z.literal(
            'com.twilio.messaging.message.sent' satisfies TwilioEventType,
        ),

        data: z.object({
            messageSid: z.string(),
        }),
    }),

    z.object({
        type: z.literal(
            'com.twilio.messaging.message.delivered' satisfies TwilioEventType,
        ),

        data: z.object({
            messageSid: z.string(),
        }),
    }),
]);

export const twilioEventWebhookBodySchema = z.array(twilioEventSchema);
