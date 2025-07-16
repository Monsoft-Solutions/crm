import { streamText as aiSdkStreamText, Message, smoothStream, Tool } from 'ai';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { AiRequest } from '../schemas';

import { thinkTool } from '../tools/think.tool';

import { aiModelToSdkModel } from '@ai/utils';

import { initLangfuseTraceAndGeneration } from './init-langfuse-trace-and-generation.provider';

export const streamText = (async ({ prompt, messages, modelParams, tools }) => {
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
            toolsNames: Object.keys(tools ?? {}),
            ...promptOrMessages,
        });

    if (traceAndGenerationError)
        return Error('FAIL_TO_INIT_LANGFUSE_TRACE_AND_GENERATION');

    const { langfuse, trace, generation } = traceAndGeneration;

    const { textStream } = aiSdkStreamText({
        model,
        ...promptOrMessages,

        tools: {
            ...tools,
            think: thinkTool,
        },
        maxSteps: 10,
        maxRetries: 3,

        temperature: modelParams.temperature,

        experimental_transform: smoothStream(),

        onStepFinish: (step) => {
            if (step.finishReason === 'stop' || step.toolCalls.length === 0) {
                return;
            }

            trace.event({
                name: `event_inner_step_${
                    step.toolCalls.at(0)?.toolName ?? 'no_tool'
                }`,
                metadata: {
                    stepType: step.stepType,
                    finishReason: step.finishReason,
                    modelId: step.response.modelId,
                },
                input: step.request.body,
                output: step.response.messages,
            });
        },

        onFinish: async (result) => {
            generation.end({
                input: messages && messages.length > 0 ? messages : prompt,
                output: result.text,
                usage: {
                    input: result.usage.promptTokens,
                    output: result.usage.completionTokens,
                    total: result.usage.totalTokens,
                },
                metadata: {
                    finishReason: result.finishReason,
                    steps: result.steps.map((step) => ({
                        type: step.stepType,
                        finishReason: step.finishReason,
                        input: step.request.body,
                        output: step.text,
                    })),
                },
            });
            await langfuse.flushAsync();
        },

        onError: async (error) => {
            trace.event({
                name: 'error',
                metadata: {
                    error: error.error,
                },
            });

            trace.update({
                metadata: {
                    error: error.error,
                },
                tags: ['error'],
            });

            generation.end({
                metadata: {
                    error: error.error,
                },
            });

            await langfuse.flushAsync();
        },
    });

    const reader = textStream.getReader();
    return Success(reader);
}) satisfies Function<
    {
        modelParams: AiRequest;
        tools?: Record<string, Tool>;
    } & (
        | {
              prompt: string;
              messages?: undefined;
          }
        | {
              prompt?: undefined;
              messages: Message[];
          }
    ),
    ReadableStreamDefaultReader<string>
>;
