import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { generateText } from '@ai/providers';

import { getContactCompressedChatTool } from '@mods/assistant/tools';

import tables from '@db/db';

import { emit } from '@events/providers/emit.provider';

import { getContactMessage } from '@mods/contact-message/providers/server';

export const createReplySuggestions = (async ({ db, messageId }) => {
    const { data: message, error: messageError } = await getContactMessage({
        db,
        messageId,
    });

    if (messageError) return Error('CONTACT_MESSAGE_ERROR');

    const { data: contact, error: contactError } = await catchError(
        db.query.contact.findFirst({
            where: (record, { eq }) => eq(record.id, message.contactId),

            with: {
                brand: {
                    with: {
                        assistants: true,
                    },
                },
            },
        }),
    );

    if (contactError) return Error('CONTACT_ERROR');

    if (!contact) return Error('CONTACT_NOT_FOUND');

    const { brand } = contact;

    const { assistants } = brand;

    const assistant = assistants.at(0);

    if (!assistant) return Error('BRAND_ASSISTANT_NOT_FOUND');

    const { tone, prompt: assistantPrompt, model } = assistant;

    const fullPrompt = `
    You are a assistant who replies to a message from a contact, using ${tone} tone, following these instructions:
    ${assistantPrompt}

    Taking into account this information about the brand you work for:
    ${JSON.stringify(brand, null, 2)}

    And this information about the contact:
    ${JSON.stringify(contact, null, 2)}

    Please respond with the reply. Do NOT explain the reasonning behind the reply. Keep it as short as possible, using direct and concise answer.
    `;

    const replySuggestions = [];

    let count = 0;
    while (count++ < 3) {
        const { data: response, error: responseError } = await generateText({
            messages: [
                {
                    id: uuidv4(),
                    role: 'system',
                    content: fullPrompt,
                },

                {
                    id: uuidv4(),
                    role: 'user',
                    content: message.body,
                },
            ],

            modelParams: {
                model,
                temperature: 0.5,
                callerName: 'assistant',
            },

            tools: {
                getContactCompressedChatTool,
            },
        });

        if (responseError) return Error('GENERATE_TEXT_ERROR');

        replySuggestions.push(response);
    }

    const { error: insertReplySuggestionsError } = await catchError(
        db.insert(tables.replySuggestion).values(
            replySuggestions.map((suggestion) => ({
                id: uuidv4(),
                messageId,
                content: suggestion,
            })),
        ),
    );

    if (insertReplySuggestionsError) return Error();

    emit({
        event: 'replySuggestionsCreated',
        payload: {
            messageId,
        },
    });

    return Success();
}) satisfies Function<{ db: Tx; messageId: string }, string[]>;
