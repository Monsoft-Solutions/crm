import { z } from 'zod';

import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { askAssistant as askAssistantProvider } from '../providers/server';

export const askAssistant = protectedEndpoint
    .input(
        z.object({
            assistantId: z.string(),
            prompt: z.string(),
        }),
    )
    .mutation(
        queryMutationCallback(
            async ({ input: { assistantId, prompt }, db }) => {
                const { data: response, error: responseError } =
                    await askAssistantProvider({
                        db,
                        assistantId,
                        prompt,
                    });

                if (responseError) return Error(responseError);

                return Success(response);
            },
        ),
    );
