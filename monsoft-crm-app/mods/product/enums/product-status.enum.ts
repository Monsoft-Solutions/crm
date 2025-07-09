import { z } from 'zod';

// product status enum
export const productStatusEnum = z.enum(['active', 'inactive']);

// product status type
export type ProductStatus = z.infer<typeof productStatusEnum>;
