import { z } from 'zod';

import { ResendEventType } from '../../twilio/enums';

const resendStatusEventData = z.object({
    email_id: z.string(),
});

export const resendEventWebhookBodySchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('email.sent' satisfies ResendEventType),
        data: resendStatusEventData,
    }),

    z.object({
        type: z.literal('email.delivered' satisfies ResendEventType),
        data: resendStatusEventData,
    }),

    z.object({
        type: z.literal('email.bounced' satisfies ResendEventType),
        data: resendStatusEventData,
    }),

    z.object({
        type: z.literal('email.complained' satisfies ResendEventType),
        data: resendStatusEventData,
    }),

    z.object({
        type: z.literal('email.delivery_delayed' satisfies ResendEventType),
        data: resendStatusEventData,
    }),
]);
