import { z } from 'zod';

export const resendInboundEmailReceived = z.object({
    emailId: z.string(),
    from: z.string(),
    to: z.string(),
    subject: z.string(),
    text: z.string(),
    html: z.string(),
    createdAt: z.number(),
});

export type ResendInboundEmailReceivedEvent = z.infer<
    typeof resendInboundEmailReceived
>;
