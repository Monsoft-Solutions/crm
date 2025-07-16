import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

export const createReplySuggestionsPrompt = (({
    assistant: { brand, tone, instructions },
    contact,
    compressedChatWithoutCurrentMessage,
}) => {
    if (!tone) return Error('ASSISTANT_TONE_REQUIRED');
    if (!instructions) return Error('ASSISTANT_INSTRUCTIONS_REQUIRED');

    const systemPrompt = `
    You are a assistant who replies to a message from a contact, using ${tone} tone, following these instructions:
    ${instructions}

    Taking into account this information about the brand you work for:
    ${JSON.stringify(brand, null, 2)}

    And this information about the contact:
    ${JSON.stringify(contact, null, 2)}

    And this information about the conversation, consisting of a) a list of summaries of older messages and b) a list of the latest messages (non-summarized):
    ${JSON.stringify(compressedChatWithoutCurrentMessage, null, 2)}

    Please respond with the reply. Do NOT explain the reasonning behind the reply. Keep it as short as possible, using direct and concise answer.
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
        contact: {
            id: string;
            firstName: string;
            lastName: string;
        };
        compressedChatWithoutCurrentMessage: {
            summaries: {
                id: string;
                summary: string;
            }[];
            messages: {
                id: string;
                body: string;
            }[];
        };
    },
    string
>;
