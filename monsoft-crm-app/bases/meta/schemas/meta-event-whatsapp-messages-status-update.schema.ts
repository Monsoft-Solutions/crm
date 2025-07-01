import { z } from 'zod';

import { whatsappMessageStatusEnum } from '../enums';

export const metaEventWhatsappMessagesStatusUpdateSchema = z.object({
    statuses: z.array(
        z.object({
            id: z.string(),
            status: whatsappMessageStatusEnum,
        }),
    ),
});
