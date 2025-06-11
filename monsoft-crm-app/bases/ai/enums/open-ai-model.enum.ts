import { z } from 'zod';

export const openaiModelEnum = z.enum([
    'gpt-4o-2024-05-13',
    'gpt-4o-mini-2024-07-18',
]);
