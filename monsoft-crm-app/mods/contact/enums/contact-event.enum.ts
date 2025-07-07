import { z } from 'zod';

export const contactEventEnum = z
    .discriminatedUnion('type', [
        z.object({
            type: z.literal('created'),
        }),

        z.object({
            type: z.literal('message'),
            message: z.object({
                body: z.string(),
            }),
        }),
    ])
    .and(z.object({ timestamp: z.number() }));

export type ContactEvent = z.infer<typeof contactEventEnum>;
