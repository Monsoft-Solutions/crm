import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { generateObject } from '@ai/providers';

import { generateAssistantConfigPrompt } from '../../prompts';

import {
    generateAssistantConfigSchema,
    GenerateAssistantConfig,
} from '../../schemas';

export const generateAssistantConfig = (async ({ prompt }) => {
    const { data: systemPrompt } = generateAssistantConfigPrompt({
        userPrompt: prompt,
    });

    const { data: config, error: generateError } =
        await generateObject<GenerateAssistantConfig>({
            prompt: systemPrompt,
            outputSchema: generateAssistantConfigSchema,
            modelParams: {
                model: 'claude-3-7-sonnet-latest',
                callerName: 'generate-assistant-config',
            },
        });

    if (generateError) return Error('GENERATE_ASSISTANT_CONFIG_ERROR');

    return Success(config);
}) satisfies Function<{ prompt: string }, GenerateAssistantConfig>;
