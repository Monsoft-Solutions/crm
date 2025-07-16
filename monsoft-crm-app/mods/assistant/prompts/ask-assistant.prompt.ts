import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

export const askAssistantPrompt = (({
    assistant: { brand, tone, instructions },
}) => {
    if (!tone) return Error('ASSISTANT_TONE_REQUIRED');
    if (!instructions) return Error('ASSISTANT_INSTRUCTIONS_REQUIRED');

    const systemPrompt = `
    You are ans assistant who answers in ${tone} tone and follows these instructions:
    ${instructions}

    Taking into account this information about the brand you work for:
    ${JSON.stringify(brand, null, 2)}

    Respond only with the answer to the prompt, no additional text.
    `;

    return Success(systemPrompt);
}) satisfies Function<
    {
        assistant: {
            brand: {
                id: string;
                name: string;
            };
            tone: string;
            instructions: string;
        };
    },
    string
>;
