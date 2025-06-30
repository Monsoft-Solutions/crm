import { z } from 'zod';

export const metaEventWebhookBodyMessagesFieldChangeValueSchema = z.object({
    messaging_product: z.string(),

    metadata: z.object({
        phone_number_id: z.string(),
    }),

    contacts: z.array(
        z.object({
            profile: z.object({
                name: z.string(),
            }),
        }),
    ),

    messages: z.array(
        z.object({
            from: z.string(),
            text: z.object({
                body: z.string(),
            }),
        }),
    ),
});
