import { z } from 'zod';

export const dialectSchema = z.enum(['mysql', 'postgresql']);

export type Dialect = z.infer<typeof dialectSchema>;
