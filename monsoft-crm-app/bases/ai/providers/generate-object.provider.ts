import { ZodType } from 'zod';

import { generateObject as aiSdkGenerateObject, Message, Tool } from 'ai';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { AiRequest } from '../schemas';

import { aiModelToSdkModel } from '@ai/utils';

import { initLangfuseTraceAndGeneration } from './init-langfuse-trace-and-generation.provider';

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
    const { model: modelName, callerName } = modelParams;

    const { data: model, error: modelError } =
        await aiModelToSdkModel(modelName);

    if (modelError) return Error('FAIL_TO_INFER_SDK_MODEL');

    const promptOrMessages = messages
        ? {
              messages: messages.filter(
                  (message) => message.content.length > 0,
              ),
              prompt: undefined,
          }
        : { prompt, messages: undefined };

    const { data: traceAndGeneration, error: traceAndGenerationError } =
        await initLangfuseTraceAndGeneration({
            modelName,
            callerName,
            toolsNames: [],
            ...promptOrMessages,
        });

    if (traceAndGenerationError)
        return Error('FAIL_TO_INIT_LANGFUSE_TRACE_AND_GENERATION');

    const { langfuse, generation } = traceAndGeneration;

    const { data: result, error } = await catchError(
        aiSdkGenerateObject({
            model,
            prompt,
            messages,
            schema: outputSchema,
        }),
    );

    if (error) {
        generation.end({
            input: prompt,
            output: `Error: ${String(error)}`,
            metadata: {
                error: String(error),
            },
        });

        await langfuse.flushAsync();

        return Error('AI_GENERATE_OBJECT_FAILED');
    }

    generation.end({
        input: prompt,
        output: result.object,
        usage: {
            input: result.usage.promptTokens,
            output: result.usage.completionTokens,
            total: result.usage.totalTokens,
        },
    });

    await langfuse.flushAsync();

    return Success(result.object);
};
