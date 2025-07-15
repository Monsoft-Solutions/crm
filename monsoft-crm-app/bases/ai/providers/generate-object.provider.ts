import { ZodType } from 'zod';

import { generateObject as aiSdkGenerateObject, Message, Tool } from 'ai';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { AiRequest } from '../schemas';

import { aiModelToSdkModel } from '@ai/utils';

export const generateObject = async <T>({
    prompt,
    messages,
    modelParams,
    outputSchema,
}: {
    modelParams: AiRequest;
    tools?: Record<string, Tool>;
    outputSchema: ZodType<T>;
} & (
    | {
          prompt: string;
          messages?: undefined;
      }
    | {
          prompt?: undefined;
          messages: Message[];
      }
)) => {
    const { data: model, error: modelError } = await aiModelToSdkModel(
        modelParams.model,
    );

    if (modelError) return Error('FAIL_TO_INFER_SDK_MODEL');

    const { data: result, error } = await catchError(
        aiSdkGenerateObject({
            model,
            prompt,
            messages,
            schema: outputSchema,
        }),
    );

    if (error) return Error('AI_GENERATE_OBJECT_FAILED');

    return Success(result.object);
};
