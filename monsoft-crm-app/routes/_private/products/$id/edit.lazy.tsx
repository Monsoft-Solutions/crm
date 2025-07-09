import { createLazyFileRoute } from '@tanstack/react-router';

import { ProductEditView } from '@mods/product/views';

export const Route = createLazyFileRoute('/_private/products/$id/edit')({
    component: ProductEditView,
});
