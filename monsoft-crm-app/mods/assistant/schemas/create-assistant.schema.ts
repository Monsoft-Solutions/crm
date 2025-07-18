import { z } from 'zod';

import { aiModelEnum } from '@ai/enums';

export const createAssistantSchema = z.object({
    brandId: z.string(),
    name: z.string(),
    model: aiModelEnum,
    tone: z.string(),
    instructions: z.string(),
});

export type CreateAssistant = z.infer<typeof createAssistantSchema>;
