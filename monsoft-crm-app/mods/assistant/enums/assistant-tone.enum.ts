import { z } from 'zod';

export const assistantToneEnum = z.enum(['friendly', 'professional']);

export type AssistantTone = z.infer<typeof assistantToneEnum>;
