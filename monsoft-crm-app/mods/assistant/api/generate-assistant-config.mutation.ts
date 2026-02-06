import { z } from 'zod';

import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { generateAssistantConfig as generateAssistantConfigProvider } from '../providers/server';

export const generateAssistantConfig = protectedEndpoint
    .input(z.object({ prompt: z.string() }))
    .mutation(
        queryMutationCallback(async ({ input: { prompt } }) => {
            const { data: config, error: configError } =
                await generateAssistantConfigProvider({ prompt });

            if (configError) return Error('GENERATE_ASSISTANT_CONFIG_ERROR');

            return Success(config);
        }),
    );
