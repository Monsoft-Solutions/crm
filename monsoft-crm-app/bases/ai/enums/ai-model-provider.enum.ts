import { z } from 'zod';

export const aiModelProviderEnum = z.enum(['anthropic', 'openai']);

export type AiModelProvider = z.infer<typeof aiModelProviderEnum>;
