import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { Message, Tool } from 'ai';

import { streamText } from './stream-text.provider';

import { AiRequest } from '../schemas/ai-request.schema';

export const generateText = (async ({
    prompt,
    messages,
    modelParams,
    tools,
}) => {
    const { data: textStream, error: textGenerationError } = await streamText(
        messages
            ? {
                  messages,
                  modelParams,
                  tools,
              }
            : { prompt, modelParams, tools },
    );

    if (textGenerationError) return Error();

    let text = '';

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
        const { done, value: textDelta } = await textStream.read();

        if (done) break;

        text += textDelta;
    }

    return Success(text);
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
    string
>;
