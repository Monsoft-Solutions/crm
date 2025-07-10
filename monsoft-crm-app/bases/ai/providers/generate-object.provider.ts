import { ZodSchema } from 'zod';

import {
    generateObject as aiSdkGenerateObject,
    GenerateObjectResult,
} from 'ai';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { AiRequest } from '../schemas';

import { aiModelToSdkModel } from '@ai/utils';

export const generateObject = (async ({
    prompt,
    modelParams,
    outputSchema,
}: {
    prompt: string;
    messages?: undefined;
    modelParams: AiRequest;
    outputSchema: ZodSchema;
}) => {
    const { data: model, error: modelError } = await aiModelToSdkModel(
        modelParams.model,
    );

    if (modelError) return Error('FAIL_TO_INFER_SDK_MODEL');

    const { data: result, error } = await catchError(
        aiSdkGenerateObject({
            model,
            prompt,
            schema: outputSchema,
        }),
    );

    if (error) return Error('AI_GENERATE_OBJECT_FAILED');

    return Success(result.object);
}) satisfies Function<
    {
        prompt: string;
        modelParams: AiRequest;
        outputSchema: ZodSchema;
    },
    GenerateObjectResult<unknown>['object']
>;
