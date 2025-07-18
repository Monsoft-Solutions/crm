import { z } from 'zod';

import { aiModelEnum } from '@ai/enums';

export const assistantSchema = z.object({
    name: z.string(),
    model: aiModelEnum,
    tone: z.string(),
    instructions: z.string(),
});

export type Assistant = z.infer<typeof assistantSchema>;
