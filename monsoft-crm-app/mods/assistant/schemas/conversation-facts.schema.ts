import { z } from 'zod';

export const ConversationFactsSchema = z.object({
    topicsDiscussed: z
        .array(z.string())
        .optional()
        .describe(
            'A list of key topics discussed during the conversation, such as products or pricing.',
        ),

    importantDetails: z
        .array(z.string())
        .optional()
        .describe(
            "Important details mentioned, such as personal information. For each detail, provide a topic and a brief description of the detail if necessary. For example, instead of providing just the date of birth, it should be: 'Date Of Birth: ...'",
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
        .describe(
            'Explicit requests made by the contact, such as asking for availability or pricing.',
        ),
});

export type ConversationFacts = z.infer<typeof ConversationFactsSchema>;
