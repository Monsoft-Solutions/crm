import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { Tx } from '@db/types';

import { MessageBubbleProps } from '@mods/contact-message/schemas';

import { getContactChatSummaries } from './get-contact-chat-summaries.provider';
import { getContactMessages } from './get-contact-messages.provider';

export const getContactCompressedChat = (async ({ db, contactId }) => {
    const { data: summaries, error: summariesError } =
        await getContactChatSummaries({
            contactId,
            db,
        });

    if (summariesError) return Error();

    const lastSummary = summaries.at(-1);

    const from = lastSummary ? lastSummary.to : undefined;

    const { data: messages, error: messagesError } = await getContactMessages({
        contactId,
        db,
        from,
    });

    if (messagesError) return Error();

    const compactChatHistory = {
        summaries,
        messages,
    };

    return Success(compactChatHistory);
}) satisfies Function<
    { contactId: string; db: Tx },
    {
        summaries: {
            id: string;
            summary: string;
            from: number;
            to: number;
        }[];
        messages: MessageBubbleProps[];
    }
>;
