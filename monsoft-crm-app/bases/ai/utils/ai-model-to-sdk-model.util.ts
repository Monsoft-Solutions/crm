import { LanguageModelV1 } from 'ai';

import { Success, Error } from '@errors/utils';
import { Function } from '@errors/types';

import { AiModel } from '../enums';

import { aiModelToSdkModelProvider } from './ai-model-to-sdk-model-provider.util';

export const aiModelToSdkModel = (async (model: AiModel) => {
    const { data: sdkModelProvider, error: sdkModelProviderError } =
        await aiModelToSdkModelProvider(model);

    if (sdkModelProviderError) return Error('FAIL_TO_INFER_SDK_MODEL_PROVIDER');

    return Success(sdkModelProvider(model));
}) satisfies Function<AiModel, LanguageModelV1>;
