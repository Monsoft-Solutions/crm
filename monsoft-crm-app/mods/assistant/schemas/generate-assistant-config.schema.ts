import { z } from 'zod';

import { assistantTypeEnum, detailLevelEnum, responseModeEnum } from '../enums';

export const generateAssistantConfigSchema = z.object({
    name: z.string().describe('A short, memorable name for the assistant'),

    description: z
        .string()
        .describe('A brief description of what this assistant does'),

    type: assistantTypeEnum.describe(
        'The type of assistant: sales, customer_success, support, or marketing',
    ),

    tone: z
        .string()
        .describe(
            'The conversational tone the assistant should use, e.g. friendly, professional, casual',
        ),

    instructions: z
        .string()
        .describe(
            'Detailed instructions for how the assistant should behave and respond',
        ),

    expertise: z
        .string()
        .describe(
            'The domain expertise the assistant should have, e.g. billing, onboarding, product features',
        ),

    communicationStyle: z
        .string()
        .describe(
            'The communication style, e.g. concise, detailed, empathetic, direct',
        ),

    responseTone: z
        .string()
        .describe(
            'The emotional tone of responses, e.g. warm, neutral, enthusiastic',
        ),

    detailLevel: detailLevelEnum.describe(
        'How detailed responses should be: low (brief), medium (balanced), or high (comprehensive)',
    ),

    responseMode: responseModeEnum.describe(
        'Whether to auto-send replies (auto_reply) or just suggest them for human review (suggest_reply)',
    ),
});

export type GenerateAssistantConfig = z.infer<
    typeof generateAssistantConfigSchema
>;
