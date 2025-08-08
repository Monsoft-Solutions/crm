import { z } from 'zod';

export const detailLevelEnum = z.enum(['low', 'medium', 'high']);

export type DetailLevel = z.infer<typeof detailLevelEnum>;
