import { z } from 'zod';

export const sendWhatsappResponseSchema = z.object({
    messages: z.array(
        z.object({
            id: z.string(),
        }),
    ),
});
