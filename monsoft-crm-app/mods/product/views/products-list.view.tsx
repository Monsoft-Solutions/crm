import { ProductStatus } from '../enums';

import { ProductsFiltersComponent } from '../components/products-filters-component';
import { ProductList } from '../components';

import { api } from '@api/providers/web';

import { Route } from '@routes/_private/products';

export function ProductsListView() {
    const navigate = Route.useNavigate();

    const { search, brandId, status } = Route.useSearch();

    const { data: products } = api.product.getProducts.useQuery({
        brandId,
        search,
        status,
    });

    const { data: brands } = api.brand.getBrands.useQuery();

    const onUpdateSearchFilter = async (search: string | undefined) => {
        await navigate({
            search(prev) {
                return {
                    ...prev,
                    search,
                };
            },
        });
    };

    const onUpdateBrandFilter = async (brandId: string | undefined) => {
        await navigate({
            search(prev) {
                return {
                    ...prev,
                    brandId,
                };
            },
        });
    };

    const onUpdateStatusFilter = async (status: ProductStatus | undefined) => {
        await navigate({
            search(prev) {
                return {
                    ...prev,
                    status,
                };
            },
        });
    };

    if (!brands) return null;
    if (!products) return null;

    return (
        <div className="grow overflow-y-auto p-6">
            <ProductsFiltersComponent
                brands={brands}
                search={search}
                onUpdateSearchFilter={onUpdateSearchFilter}
                brandId={brandId}
                onUpdateBrandFilter={onUpdateBrandFilter}
                status={status}
                onUpdateStatusFilter={onUpdateStatusFilter}
            />

            <ProductList products={products} />
        </div>
    );
}
