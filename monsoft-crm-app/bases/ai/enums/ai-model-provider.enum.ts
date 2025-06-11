import { z } from 'zod';

export const aiModelProviderEnum = z.enum(['anthropic', 'openai']);
