import { z } from 'zod';

export const metaEventNewWhatsappMessagesSchema = z.object({
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
