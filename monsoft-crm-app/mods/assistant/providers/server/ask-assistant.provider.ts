import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { eq } from 'drizzle-orm';

import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import tables from '@db/db';

import { generateText } from '@ai/providers';

import {
    getBrandContactsTool,
    getContactCompressedChatTool,
} from '@mods/assistant/tools';

export const askAssistant = (async ({ db, assistantId, prompt }) => {
    const { data: assistant, error: assistantError } = await catchError(
        db.query.assistant.findFirst({
            where: eq(tables.assistant.id, assistantId),

            with: {
                brand: true,
            },
        }),
    );

    if (assistantError) return Error('ASSISTANT_QUERY');

    if (!assistant) return Error('ASSISTANT_NOT_FOUND');

    const { model, brand, tone, prompt: assistantPrompt } = assistant;

    const fullPrompt = `
    You are a assistant who answers in ${tone} tone and follows these instructions:
    ${assistantPrompt}

    Taking into account this information about the brand you work for:
    ${JSON.stringify(brand, null, 2)}

    Please respond only with the answer to the prompt, no additional text.

    You are given a prompt and you need to respond to it.
    The prompt is: ${prompt}
    `;

    const { data: response, error: responseError } = await generateText({
        prompt: fullPrompt,

        modelParams: {
            model,
            callerName: 'assistant',
        },

        tools: {
            getBrandContactsTool,
            getContactCompressedChatTool,
        },
    });

    if (responseError) return Error('GENERATE_TEXT');

    return Success(response);
}) satisfies Function<{ db: Tx; assistantId: string; prompt: string }, string>;
