import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { Tx } from '@db/types';

import { streamText } from '@ai/providers';

import { getContactCompressedChat } from './get-contact-compressed-chat.provider';

import { EmailDraftTone } from '../../schemas';

const toneInstructions: Record<EmailDraftTone, string> = {
    professional:
        'Write in a professional, polished tone. Use formal language and proper business email conventions.',
    friendly:
        'Write in a warm, friendly tone. Be conversational and approachable while remaining respectful.',
    brief: 'Write concisely and directly. Get to the point quickly. Use short sentences and paragraphs.',
};

export const draftEmailWithAi = (async ({
    db,
    contactId,
    subject,
    tone,
    userId,
}) => {
    const { data: chatHistory, error: chatError } =
        await getContactCompressedChat({ db, contactId });

    if (chatError) return Error();

    const { summaries, messages } = chatHistory;

    // Build conversation context
    const contextParts: string[] = [];

    if (summaries.length > 0) {
        contextParts.push('Previous conversation summaries:');
        for (const s of summaries) {
            contextParts.push(`- ${s.summary}`);
        }
    }

    if (messages.length > 0) {
        contextParts.push('\nRecent messages:');
        for (const m of messages) {
            const prefix = m.direction === 'inbound' ? 'Contact' : 'Us';
            const channel = m.channelType.toUpperCase();
            contextParts.push(`[${channel}] ${prefix}: ${m.body}`);
        }
    }

    const conversationContext = contextParts.join('\n');

    const prompt = `You are a helpful assistant drafting an email reply for a CRM user.

${toneInstructions[tone]}

Here is the conversation history with this contact across all channels (SMS, WhatsApp, Email):

${conversationContext}

${subject ? `The email subject is: "${subject}"` : 'No subject has been specified yet.'}

Draft the email body only (no subject line, no greeting signature). The user will review and edit before sending.`;

    const { data: reader, error: streamError } = await streamText({
        modelParams: {
            model: 'claude-3-5-haiku-latest',
            callerName: 'draftEmailWithAi',
            userId,
        },
        prompt,
    });

    if (streamError) return Error();

    return Success(reader);
}) satisfies Function<
    {
        db: Tx;
        contactId: string;
        subject?: string;
        tone: EmailDraftTone;
        userId: string;
    },
    ReadableStreamDefaultReader<string>
>;
