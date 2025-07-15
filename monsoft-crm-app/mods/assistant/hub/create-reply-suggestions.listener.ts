import { listen } from '@events/providers/listen.provider';

import { db } from '@db/providers/server';

import { createReplySuggestions } from '../providers/server';

void listen(
    'newContactMessage',

    async ({ id: messageId, direction }) => {
        if (direction !== 'inbound') return;

        const { error: createReplySuggestionsError } =
            await createReplySuggestions({
                db,
                messageId,
            });

        if (createReplySuggestionsError) return;
    },
);
