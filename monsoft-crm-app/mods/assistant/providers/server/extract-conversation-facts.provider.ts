import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { generateObject } from '@ai/providers';

import {
    ConversationFacts,
    ConversationFactsSchema,
} from '@mods/assistant/schemas';

import { getContactMessages } from '@mods/contact-message/providers/server';

import tables from '@db/db';

import { extractConversationFactsPrompt } from '../../prompts';

export const extractConversationFacts = (async ({ db, contactId }) => {
    const { data: contactMessages, error: contactMessagesError } =
        await getContactMessages({
            db,
            contactId,
        });

    if (contactMessagesError) return Error('CONTACT_MESSAGES_ERROR');

    const messages = contactMessages.map(({ direction, body }) => ({
        id: uuidv4(),
        role:
            direction === 'inbound'
                ? ('user' as const)
                : ('assistant' as const),
        content: body,
    }));

    const { data: systemPrompt } = extractConversationFactsPrompt();

    const { data: conversationFacts, error: conversationFactsError } =
        await generateObject({
            messages: [
                {
                    id: uuidv4(),
                    role: 'system',
                    content: systemPrompt,
                },

                ...messages,
            ],

            modelParams: {
                // TODO: allow custom model
                model: 'gpt-4o-mini-2024-07-18',
                callerName: 'extract-conversation-facts',
            },

            outputSchema: ConversationFactsSchema,
        });

    if (conversationFactsError)
        return Error('EXTRACT_CONVERSATION_FACTS_ERROR');

    const conversationFactsId = uuidv4();

    const { error: conversationFactsInsertError } = await catchError(
        db.insert(tables.conversationFacts).values({
            id: conversationFactsId,
            contactId,
            facts: conversationFacts,
        }),
    );

    if (conversationFactsInsertError)
        return Error('CONVERSATION_FACTS_INSERT_ERROR');

    return Success(conversationFacts);
}) satisfies Function<{ db: Tx; contactId: string }, ConversationFacts>;
