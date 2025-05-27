import { z } from 'zod';

export const langCodeEnum = z.enum(['en', 'es']);

export type LangCode = z.infer<typeof langCodeEnum>;
