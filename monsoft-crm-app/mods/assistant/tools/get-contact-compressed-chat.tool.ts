import { z } from 'zod';

import { tool } from 'ai';

import { db } from '@db/providers/server';

import { getContactCompressedChat } from '@mods/contact-message/providers/server';

export const getContactCompressedChatTool = tool({
    parameters: z.object({
        contactId: z
            .string()
            .describe(
                'The id of the contact to get the compressed chat history from',
            ),
    }),

    description:
        'Use the tool to get the compressed chat history of a contact. It will return the compressed chat: summaries and non-summarized messages.',

    execute: async ({ contactId }) => {
        const { data: compressedChat, error: compressedChatError } =
            await getContactCompressedChat({
                contactId,
                db,
            });

        if (compressedChatError) return 'FAIL_TO_GET_COMPRESSED_CHAT';

        return compressedChat;
    },
});
