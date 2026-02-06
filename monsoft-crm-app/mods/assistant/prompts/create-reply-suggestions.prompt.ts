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

    Respond with a JSON object containing a "suggestions" array with exactly 3 reply suggestions. Each suggestion should have:
    - "content": your reply message. Do NOT explain the reasoning behind the reply. Keep it as short as possible, using direct and concise answer.
    - "certaintyLevel": how confident you are that this is the right reply ("low", "medium", or "high")
      - "high": you have clear context and the reply directly addresses the contact's message
      - "medium": you have some context but the reply may need human review
      - "low": you lack context or the message is ambiguous

    Each suggestion should offer a different approach or phrasing to give the user meaningful choices.
    `;

    return Success(systemPrompt);
}) satisfies Function<
    {
        assistant: {
            brand: {
                id: string;
                name: string;
                brandVoice: {
                    coreValues: string | null;
                    personalityTraits: string | null;
                    communicationStyle: string | null;
                    languagePreferences: string | null;
                    voiceGuidelines: string | null;
                    prohibitedContent: string | null;
                };
                brandMarket: {
                    keyProducts: string | null;
                    differentiators: string | null;
                    painPoints: string | null;
                    targetSegments: string | null;
                };
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
