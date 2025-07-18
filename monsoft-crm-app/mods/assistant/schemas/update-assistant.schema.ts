import { z } from 'zod';

import { aiModelEnum } from '@ai/enums';

export const updateAssistantSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    model: aiModelEnum.optional(),
    tone: z.string().optional(),
    instructions: z.string().optional(),
});

export type UpdateAssistant = z.infer<typeof updateAssistantSchema>;
