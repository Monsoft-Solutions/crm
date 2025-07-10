import { z } from 'zod';

import { anthropicModelEnum } from './anthropic-model.enum';
import { openaiModelEnum } from './open-ai-model.enum';

export const aiModelEnum = z.union([anthropicModelEnum, openaiModelEnum]);

export type AiModel = z.infer<typeof aiModelEnum>;
