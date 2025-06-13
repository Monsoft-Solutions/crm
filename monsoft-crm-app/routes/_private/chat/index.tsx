import { createFileRoute, Navigate } from '@tanstack/react-router';

import { apiClientUtils } from '@api/providers/web';

import { CreateBrandCard } from '@mods/brand/components/create-brand-card.component';

export const Route = createFileRoute('/_private/chat/')({
    async loader() {
        const result = await apiClientUtils.brand.getBrandsIds.ensureData();

        const brands = result.error ? [] : result.data;

        const brandsIds = brands.map(({ id }) => id);

        const defaultBrandId = brandsIds.at(0);

        return { defaultBrandId };
    },

    component: function Component() {
        const { defaultBrandId } = Route.useLoaderData();

        if (!defaultBrandId) return <CreateBrandCard />;

        return (
            <Navigate
                to="/chat/$brandId"
                params={{ brandId: defaultBrandId }}
            />
        );
    },
});
