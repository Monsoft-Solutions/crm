import { listen } from '@events/providers/listen.provider';

import { db } from '@db/providers/server';

import { ensureChatCompression } from '../providers/server';

void listen(
    'newContactMessage',

    async ({ contactId }) => {
        const { error: ensureChatCompressionError } =
            await ensureChatCompression({
                db,
                contactId,
            });

        if (ensureChatCompressionError) return;
    },
);
