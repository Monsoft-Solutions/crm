import { createLazyFileRoute } from '@tanstack/react-router';

import { ProductCreateView } from '@mods/product/views';

export const Route = createLazyFileRoute('/_private/products/new')({
    component: ProductCreateView,
});
