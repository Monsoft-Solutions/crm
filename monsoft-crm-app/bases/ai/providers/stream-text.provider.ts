import { streamText as aiSdkStreamText, Message, smoothStream } from 'ai';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { AiRequest } from '../schemas';

import { thinkTool } from '../tools/think.tool';

import { aiModelToSdkModel } from '@ai/utils';

export const streamText = (async ({
    prompt,
    messages,
    modelParams,
}:
    | {
          prompt: string;
          messages?: undefined;
          modelParams: AiRequest;
      }
    | {
          prompt?: undefined;
          messages: Message[];
          modelParams: AiRequest;
      }) => {
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
            think: thinkTool,
        },
        experimental_activeTools: modelParams.activeTools,
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
    | { prompt: string; messages?: undefined; modelParams: AiRequest }
    | { prompt?: undefined; messages: Message[]; modelParams: AiRequest },
    ReadableStreamDefaultReader<string>
>;
