import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

export const createReplySuggestionsPrompt = (({
    assistant: { brand, tone, instructions },
    contact,
    compressedChatWithoutCurrentMessage,
    channelType,
}) => {
    if (!tone) return Error('ASSISTANT_TONE_REQUIRED');
    if (!instructions) return Error('ASSISTANT_INSTRUCTIONS_REQUIRED');

    const brandContextLines: string[] = [];

    brandContextLines.push(`Brand: ${brand.name}`);

    const { brandVoice, brandMarket } = brand;

    const voiceParts = [
        brandVoice.coreValues && `Core values: ${brandVoice.coreValues}`,
        brandVoice.personalityTraits &&
            `Personality: ${brandVoice.personalityTraits}`,
        brandVoice.communicationStyle &&
            `Communication style: ${brandVoice.communicationStyle}`,
        brandVoice.languagePreferences &&
            `Language preferences: ${brandVoice.languagePreferences}`,
        brandVoice.voiceGuidelines &&
            `Voice guidelines: ${brandVoice.voiceGuidelines}`,
        brandVoice.prohibitedContent &&
            `Prohibited content: ${brandVoice.prohibitedContent}`,
    ].filter((v): v is string => Boolean(v));

    if (voiceParts.length > 0) {
        brandContextLines.push(...voiceParts);
    }

    const marketParts = [
        brandMarket.keyProducts && `Key products: ${brandMarket.keyProducts}`,
        brandMarket.differentiators &&
            `Differentiators: ${brandMarket.differentiators}`,
        brandMarket.painPoints && `Pain points: ${brandMarket.painPoints}`,
        brandMarket.targetSegments &&
            `Target segments: ${brandMarket.targetSegments}`,
    ].filter((v): v is string => Boolean(v));

    if (marketParts.length > 0) {
        brandContextLines.push(...marketParts);
    }

    const brandContext = brandContextLines.join('\n');

    const { summaries, messages } = compressedChatWithoutCurrentMessage;

    const conversationLines: string[] = [];

    if (summaries.length > 0) {
        conversationLines.push(
            '[Summary of earlier messages]',
            ...summaries.map((s) => s.summary),
            '',
        );
    }

    for (const msg of messages) {
        const speaker = msg.direction === 'inbound' ? '[Contact]' : '[You]';
        conversationLines.push(`${speaker}: ${msg.body}`);
    }

    const hasHistory = summaries.length > 0 || messages.length > 0;

    const conversationSection =
        conversationLines.length > 0
            ? `Conversation so far:\n${conversationLines.join('\n')}`
            : 'No prior messages — this is the first interaction.';

    const systemPrompt = `You are replying to a contact on behalf of a brand. Follow these instructions strictly:
${instructions}

Use a ${tone} tone throughout.

${brandContext}

You are speaking with ${contact.firstName} ${contact.lastName}.

${conversationSection}

IMPORTANT:
- This is a ${channelType} conversation. Keep replies appropriately concise.
- ${hasHistory ? `The conversation is already ongoing — do NOT open with greetings, introductions, or "Hi ${contact.firstName}". Continue naturally from where the conversation left off.` : 'This is the very first interaction, so you may greet the contact.'}
- Reply directly to what the contact just said.

Respond with a JSON object containing a "suggestions" array with exactly 3 reply suggestions. Each suggestion should have:
- "content": your reply message. Do NOT explain the reasoning behind the reply. Keep it as short as possible, using direct and concise answer.
- "certaintyLevel": how confident you are that this is the right reply ("low", "medium", or "high")
  - "high": you have clear context and the reply directly addresses the contact's message
  - "medium": you have some context but the reply may need human review
  - "low": you lack context or the message is ambiguous

Each suggestion should offer a different approach or phrasing to give the user meaningful choices.`;

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
                direction: 'inbound' | 'outbound';
            }[];
        };
        channelType: string;
    },
    string
>;
