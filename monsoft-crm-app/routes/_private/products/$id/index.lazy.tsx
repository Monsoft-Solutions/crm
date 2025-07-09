import { createLazyFileRoute } from '@tanstack/react-router';

import { ProductDetailView } from '@mods/product/views';

export const Route = createLazyFileRoute('/_private/products/$id/')({
    component: ProductDetailView,
});
