import { z } from 'zod';

import { metaEventNewWhatsappMessagesSchema } from './meta-event-new-whatsapp-messages.schema';
import { metaEventWhatsappMessagesStatusUpdateSchema } from './meta-event-whatsapp-messages-status-update.schema';

export const metaEventWebhookBodyMessagesFieldChangeValueSchema = z
    .object({
        messaging_product: z.string(),

        metadata: z.object({
            phone_number_id: z.string(),
        }),
    })
    .and(
        metaEventNewWhatsappMessagesSchema.or(
            metaEventWhatsappMessagesStatusUpdateSchema,
        ),
    );
