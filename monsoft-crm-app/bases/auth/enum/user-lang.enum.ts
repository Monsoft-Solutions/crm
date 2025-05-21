import { z } from 'zod';

export const userLangEnumSchema = z.enum(['en', 'es']);

export type UserLang = z.infer<typeof userLangEnumSchema>;
