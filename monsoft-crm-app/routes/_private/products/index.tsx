import { createFileRoute } from '@tanstack/react-router';

import { ProductsListView } from '@mods/product/views';

import { z } from 'zod';

import { productStatusEnum } from '@mods/product/enums';

export const Route = createFileRoute('/_private/products/')({
    validateSearch: z.object({
        search: z.string().optional(),
        brandId: z.string().optional(),
        status: productStatusEnum.optional(),
    }),

    component: ProductsListView,
});
