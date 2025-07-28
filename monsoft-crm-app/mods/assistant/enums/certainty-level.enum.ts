import { z } from 'zod';

export const certaintyLevelEnum = z.enum(['low', 'medium', 'high']);

export type CertaintyLevel = z.infer<typeof certaintyLevelEnum>;
