import { z } from 'zod';

import { aiModelEnum } from '@ai/enums';
import { assistantTypeEnum, detailLevelEnum, responseModeEnum } from '../enums';

export const assistantSchema = z.object({
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
    responseMode: responseModeEnum,
});

export type Assistant = z.infer<typeof assistantSchema>;
