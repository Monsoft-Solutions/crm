import { createFileRoute, Navigate } from '@tanstack/react-router';

import { apiClientUtils, vanillaApi } from '@api/providers/web';

export const Route = createFileRoute('/_private/chat/')({
    async loader() {
        const result = await apiClientUtils.brand.getBrandsIds.ensureData();

        const brands = result.error ? [] : result.data;

        const brandsIds = brands.map(({ id }) => id);

        const defaultBrandId = brandsIds.at(0);

        if (!defaultBrandId) {
            const result = await vanillaApi.brand.createBrand.mutate({
                name: '',
            });

            const newBrandId = result.error ? '' : result.data.brandId;

            return { defaultBrandId: newBrandId };
        }

        return { defaultBrandId };
    },

    component: function Component() {
        const { defaultBrandId } = Route.useLoaderData();

        return (
            <Navigate
                to="/brand/$brandId/chat"
                params={{ brandId: defaultBrandId }}
            />
        );
    },
});
