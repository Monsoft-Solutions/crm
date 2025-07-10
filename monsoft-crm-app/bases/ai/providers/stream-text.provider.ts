import { streamText as aiSdkStreamText, Message, smoothStream, Tool } from 'ai';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { AiRequest } from '../schemas';

import { thinkTool } from '../tools/think.tool';

import { aiModelToSdkModel } from '@ai/utils';

export const streamText = (async ({ prompt, messages, modelParams, tools }) => {
    const { data: model, error: modelError } = await aiModelToSdkModel(
        modelParams.model,
    );

    if (modelError) return Error('FAIL_TO_INFER_SDK_MODEL');

    const cleanMessages = messages?.filter(
        (message) => message.content.length > 0,
    );

    const { textStream } = aiSdkStreamText({
        model,
        prompt,
        messages: cleanMessages,
        tools: {
            ...tools,
            think: thinkTool,
        },
        maxSteps: 10,
        maxRetries: 3,

        experimental_transform: smoothStream(),

        onStepFinish: (step) => {
            if (step.finishReason === 'stop') {
                return;
            }
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
