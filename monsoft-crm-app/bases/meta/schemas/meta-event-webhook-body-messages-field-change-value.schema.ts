import { z } from 'zod';

import { metaEventNewWhatsappMessagesSchema } from './meta-event-new-whatsapp-messages.schema';

export const metaEventWebhookBodyMessagesFieldChangeValueSchema = z
    .object({
        messaging_product: z.string(),

        metadata: z.object({
            phone_number_id: z.string(),
        }),
    })
    .and(metaEventNewWhatsappMessagesSchema);
