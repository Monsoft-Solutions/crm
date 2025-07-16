import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { generateText } from '@ai/providers';

import tables from '@db/db';

import { emit } from '@events/providers/emit.provider';

import {
    getContactCompressedChat,
    getContactMessage,
} from '@mods/contact-message/providers/server';

import { createReplySuggestionsPrompt } from '../../prompts';

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

    const { data: compressedChat, error: compressedChatError } =
        await getContactCompressedChat({
            db,
            contactId: message.contactId,
        });

    if (compressedChatError) return Error('COMPRESSED_CHAT_ERROR');

    const compressedChatWithoutCurrentMessage: typeof compressedChat = {
        summaries: compressedChat.summaries,
        messages: compressedChat.messages.filter(({ id }) => id !== messageId),
    };

    const { data: systemPrompt, error: systemPromptError } =
        createReplySuggestionsPrompt({
            assistant: { brand, tone, instructions: assistantPrompt },
            contact,
            compressedChatWithoutCurrentMessage,
        });

    if (systemPromptError) return Error('CREATE_REPLY_SUGGESTIONS_PROMPT');

    const replySuggestions = [];

    let count = 0;
    while (count++ < 3) {
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
                    content: message.body,
                },
            ],

            modelParams: {
                model,
                temperature: 0.5,
                callerName: 'assistant',
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
