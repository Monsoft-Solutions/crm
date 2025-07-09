import { z } from 'zod';

export const productStockStatusEnum = z.enum([
    'out_of_stock',
    'low_stock',
    'in_stock',
]);

export type ProductStockStatus = z.infer<typeof productStockStatusEnum>;
