import { ProductDetail } from '../components';

import { api } from '@api/providers/web';

import { Route } from '@routes/_private/products/$id/index.lazy';

// view for viewing/editing a single product
export function ProductDetailView() {
    const { id: productId } = Route.useParams();

    // get product details
    const {
        data: product,
        error: productError,
        isLoading: isLoadingProduct,
    } = api.product.getProduct.useQuery({ id: productId });

    if (isLoadingProduct || productError) return;

    return (
        <div className="grow overflow-y-auto p-6">
            <ProductDetail product={product} />
        </div>
    );
}
