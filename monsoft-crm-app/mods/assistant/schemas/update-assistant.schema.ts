import { z } from 'zod';

import { aiModelEnum } from '@ai/enums';
import { assistantTypeEnum, detailLevelEnum, responseModeEnum } from '../enums';

export const updateAssistantSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    model: aiModelEnum.optional(),
    type: assistantTypeEnum.optional(),
    tone: z.string().optional(),
    instructions: z.string().optional(),
    expertise: z.string().optional(),
    communicationStyle: z.string().optional(),
    responseTone: z.string().optional(),
    detailLevel: detailLevelEnum.optional(),
    responseMode: responseModeEnum.optional(),
});

export type UpdateAssistant = z.infer<typeof updateAssistantSchema>;
