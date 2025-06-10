import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { Message } from 'ai';

import { streamText } from './stream-text.provider';

import { AiRequest } from '../schemas/ai-request.schema';

export const generateText = (async ({
    prompt,
    messages,
    modelParams,
}: (
    | {
          prompt: string;
          messages?: undefined;
      }
    | {
          prompt?: undefined;
          messages: Message[];
      }
) & {
    modelParams: AiRequest;
}) => {
    const { data: textStream, error: textGenerationError } = await streamText(
        messages
            ? {
                  messages,
                  modelParams,
              }
            : { prompt, modelParams },
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
}) satisfies Function<{ prompt: string; modelParams: AiRequest }, string>;
