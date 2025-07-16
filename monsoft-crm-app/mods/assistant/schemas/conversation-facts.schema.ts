import { z } from 'zod';

export const ConversationFactsSchema = z.object({
    topicsDiscussed: z
        .array(z.string())
        .optional()
        .nullable()
        .describe(
            'A list of key topics discussed during the conversation, such as products or pricing.',
        ),

    questionsByContact: z
        .array(z.string())
        .optional()
        .nullable()
        .describe(
            'Specific questions asked by the contact during the conversation.',
        ),

    requestsByContact: z
        .array(z.string())
        .optional()
        .nullable()
        .describe('Explicit requests made by the contact.'),
});

export type ConversationFacts = z.infer<typeof ConversationFactsSchema>;
