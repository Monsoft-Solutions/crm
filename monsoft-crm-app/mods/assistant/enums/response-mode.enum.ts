import { z } from 'zod';

export const responseModeEnum = z.enum(['auto_reply', 'suggest_reply']);

export type ResponseMode = z.infer<typeof responseModeEnum>;
