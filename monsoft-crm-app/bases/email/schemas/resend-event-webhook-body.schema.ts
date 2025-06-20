import { z } from 'zod';

import { ResendEventType } from '../../twilio/enums';

export const resendEventWebhookBodySchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('email.sent' satisfies ResendEventType),

        data: z.object({
            email_id: z.string(),
        }),
    }),

    z.object({
        type: z.literal('email.delivered' satisfies ResendEventType),

        data: z.object({
            email_id: z.string(),
        }),
    }),
]);
