import { z } from 'zod';

import { aiModelEnum } from '@ai/enums';
import { assistantTypeEnum, detailLevelEnum } from '../enums';

export const createAssistantSchema = z.object({
    brandId: z.string(),
    name: z.string(),
    description: z.string(),
    model: aiModelEnum,
    type: assistantTypeEnum,
    tone: z.string(),
    instructions: z.string(),
    expertise: z.string(),
    communicationStyle: z.string(),
    responseTone: z.string(),
    detailLevel: detailLevelEnum,
});

export type CreateAssistant = z.infer<typeof createAssistantSchema>;
