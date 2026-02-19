import { protectedEndpoint } from '@api/providers/server';

import { db } from '@db/providers/server';

import { draftEmailWithAiSchema } from '../schemas';

import { draftEmailWithAi } from '../providers/server';

export const onDraftEmailWithAi = protectedEndpoint
    .input(draftEmailWithAiSchema)
    .subscription(async function* ({
        ctx: {
            session: { user },
        },
        input: { contactId, subject, tone },
        signal,
    }) {
        const { data: reader, error } = await draftEmailWithAi({
            db,
            contactId,
            subject,
            tone,
            userId: user.id,
        });

        if (error) return;

        try {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            while (true) {
                if (signal?.aborted) break;

                const { done, value } = await reader.read();

                if (done) break;

                yield value;
            }
        } finally {
            reader.releaseLock();
        }
    });
