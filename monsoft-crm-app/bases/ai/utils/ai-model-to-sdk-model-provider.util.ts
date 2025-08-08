import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

import { getCoreConf } from '@conf/core/providers/server';

import { AiModel } from '../enums';

import { aiModelToProvider } from './ai-model-to-provider.util';

import { Error, Success } from '@errors/utils';

export const aiModelToSdkModelProvider = async (model: AiModel) => {
    // get the core configuration
    const coreConfWithError = await getCoreConf();

    const { error: coreConfError } = coreConfWithError;

    if (coreConfError !== null) return Error('MISSING_CORE_CONF');

    const { data: coreConf } = coreConfWithError;

    const { anthropicApiKey, openaiApiKey } = coreConf;

    const provider = aiModelToProvider(model);

    switch (provider) {
        case 'anthropic': {
            return Success(
                createAnthropic({
                    apiKey: anthropicApiKey,
                }),
            );
        }

        case 'openai': {
            return Success(
                createOpenAI({
                    apiKey: openaiApiKey,
                }),
            );
        }
    }
};
