import { z } from 'zod';

export const companySizeEnum = z.enum([
    'startup',
    'small',
    'medium',
    'enterprise',
]);

export type CompanySize = z.infer<typeof companySizeEnum>;
