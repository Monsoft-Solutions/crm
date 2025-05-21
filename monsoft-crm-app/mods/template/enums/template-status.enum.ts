import { z } from 'zod';

// template status enum
export const templateStatusEnum = z.enum(['draft', 'finished']);

// template status type
export type TemplateStatus = z.infer<typeof templateStatusEnum>;
