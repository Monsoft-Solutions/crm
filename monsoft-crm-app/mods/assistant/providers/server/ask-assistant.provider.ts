import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { eq } from 'drizzle-orm';

import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import tables from '@db/db';

import { generateText } from '@ai/providers';

import { askAssistantPrompt } from '../../prompts';

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

    const { data: systemPrompt, error: systemPromptError } = askAssistantPrompt(
        {
            assistant: {
                brand,
                tone,
                instructions: assistantPrompt,
            },
        },
    );

    if (systemPromptError) return Error('ASK_ASSISTANT_PROMPT');

    const { data: response, error: responseError } = await generateText({
        messages: [
            {
                id: uuidv4(),
                role: 'system',
                content: systemPrompt,
            },

            {
                id: uuidv4(),
                role: 'user',
                content: prompt,
            },
        ],

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
