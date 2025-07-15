import { protectedEndpoint, subscribe } from '@api/providers/server';

import { z } from 'zod';

export const onReplySuggestionsCreated = protectedEndpoint
    .input(
        z.object({
            messageId: z.string(),
        }),
    )
    .subscription(
        subscribe(
            'replySuggestionsCreated',

            ({
                input: { messageId },

                data: replySuggestions,
            }) => {
                if (replySuggestions.messageId !== messageId) return;

                return replySuggestions;
            },
        ),
    );
