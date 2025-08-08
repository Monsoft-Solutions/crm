import { z } from 'zod';

export const assistantTypeEnum = z.enum([
    'sales',
    'customer_success',
    'support',
    'marketing',
]);

export type AssistantType = z.infer<typeof assistantTypeEnum>;
