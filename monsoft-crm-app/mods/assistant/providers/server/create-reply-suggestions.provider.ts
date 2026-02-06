import { v4 as uuidv4 } from 'uuid';

import { eq } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { generateObject } from '@ai/providers';

import tables from '@db/db';

import { emit } from '@events/providers/emit.provider';

import {
    getContactCompressedChat,
    getContactMessage,
} from '@mods/contact-message/providers/server';

import { createReplySuggestionsPrompt } from '../../prompts';

import { sendMessageToContact } from '@mods/contact-message/providers/server';

import { replySuggestionOutputSchema } from '../../schemas';

export const createReplySuggestions = (async ({ db, messageId }) => {
    const { data: message, error: messageError } = await getContactMessage({
        db,
        messageId,
    });

    if (messageError) return Error('CONTACT_MESSAGE_ERROR');

    const { data: contact, error: contactError } = await catchError(
        db.query.contact.findFirst({
            where: (record, { eq }) => eq(record.id, message.contactId),

            columns: {
                id: true,
                brandId: true,
                firstName: true,
                lastName: true,
                assistantId: true,
            },

            with: {
                brand: {
                    with: {
                        brandVoice: true,
                        brandMarket: true,
                        assistants: true,
                    },
                },
            },
        }),
    );

    if (contactError) return Error('CONTACT_ERROR');

    if (!contact) return Error('CONTACT_NOT_FOUND');

    const { brand } = contact;

    let assistant = contact.assistantId
        ? brand.assistants.find((a) => a.id === contact.assistantId)
        : undefined;

    if (!assistant) {
        assistant = brand.assistants.at(0);
    }

    if (!assistant) return Error('BRAND_ASSISTANT_NOT_FOUND');

    const { tone, instructions, model, responseMode } = assistant;

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
            assistant: { brand, tone, instructions },
            contact,
            compressedChatWithoutCurrentMessage,
            channelType: message.channelType,
        });

    if (systemPromptError) return Error('CREATE_REPLY_SUGGESTIONS_PROMPT');

    const { data: result, error: generateError } = await generateObject({
        messages: [
            { id: uuidv4(), role: 'system', content: systemPrompt },
            { id: uuidv4(), role: 'user', content: message.body },
        ],
        modelParams: { model, temperature: 0.5, callerName: 'assistant' },
        outputSchema: replySuggestionOutputSchema,
    });

    if (generateError) return Error('GENERATE_TEXT_ERROR');

    const replySuggestions = result.suggestions;

    const suggestionRecords = replySuggestions.map(
        ({ content, certaintyLevel }) => ({
            id: uuidv4(),
            messageId,
            content,
            certaintyLevel,
        }),
    );

    const { error: insertReplySuggestionsError } = await catchError(
        db.insert(tables.replySuggestion).values(suggestionRecords),
    );

    if (insertReplySuggestionsError) return Error();

    if (responseMode === 'auto_reply') {
        const certaintyPriority = ['high', 'medium', 'low'] as const;

        const bestSuggestion = certaintyPriority.reduce<
            (typeof suggestionRecords)[number] | undefined
        >((found, level) => {
            if (found) return found;
            const index = replySuggestions.findIndex(
                (s) => s.certaintyLevel === level,
            );
            return index !== -1 ? suggestionRecords[index] : undefined;
        }, undefined);

        if (bestSuggestion) {
            const { error: sendError } = await catchError(
                sendMessageToContact({
                    db,
                    contactId: message.contactId,
                    channelType: message.channelType,
                    body: bestSuggestion.content,
                }),
            );

            if (!sendError) {
                await catchError(
                    db
                        .update(tables.replySuggestion)
                        .set({ selectedAt: Date.now() })
                        .where(
                            eq(tables.replySuggestion.id, bestSuggestion.id),
                        ),
                );
            }
        }
    } else {
        emit({
            event: 'replySuggestionsCreated',
            payload: {
                messageId,
            },
        });
    }

    return Success();
}) satisfies Function<{ db: Tx; messageId: string }, string[]>;
