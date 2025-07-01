import { z } from 'zod';

export const metaEventWebhookBodySchema = z.object({
    object: z.literal('whatsapp_business_account'),

    entry: z.array(
        z.object({
            changes: z.array(
                z.object({
                    field: z.string(),

                    value: z.unknown(),
                }),
            ),
        }),
    ),
});
