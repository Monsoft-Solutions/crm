import { useState } from 'react';

import { api } from '@api/providers/web';

import { Card, CardContent, CardHeader, CardTitle } from '@ui/card.ui';
import { Button } from '@ui/button.ui';

import { ArrowLeft } from 'lucide-react';

import { ProductForm } from '../components';

import { Route } from '@routes/_private/products/$id/edit.lazy';

// view for editing an existing product
export function ProductEditView() {
    const navigate = Route.useNavigate();
    const { id: productId } = Route.useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // get product details
    const {
        data: product,
        error: productError,
        isLoading: isLoadingProduct,
    } = api.product.getProduct.useQuery({ id: productId });

    // get brands for form dropdown
    const {
        data: brands,
        error: brandsError,
        isLoading: isLoadingBrands,
    } = api.brand.getBrands.useQuery();

    const handleSubmit = async (data: {
        name: string;
        description?: string;
        sku: string;
        brandId: string;
        price: number;
        stock: number;
        status: 'active' | 'inactive';
    }) => {
        setIsSubmitting(true);

        try {
            const { error } = await api.product.updateProduct.mutate({
                id: productId,
                name: data.name,
                description: data.description,
                sku: data.sku,
                price: data.price,
                stock: data.stock,
                status: data.status,
            });

            if (error) {
                alert('Failed to update product. Please try again.');
                return;
            }

            // Navigate back to product detail view on success
            void navigate({
                to: '/products/$id',
                params: { id: productId },
            });
        } catch (error) {
            console.error('Error updating product:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        void navigate({
            to: '/products/$id',
            params: { id: productId },
        });
    };

    if (isLoadingProduct || productError) return;

    if (isLoadingBrands || brandsError) return;

    return (
        <div className="h-screen grow overflow-y-scroll">
            {/* Header */}
            <div className="mb-6">
                <div className="mb-4 flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Product
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Product</h1>
                        <p className="text-muted-foreground">
                            Update product information for{' '}
                            <strong>{product.name}</strong>
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProductForm
                            initialData={{
                                name: product.name,
                                description: product.description ?? undefined,
                                sku: product.sku,
                                brandId: product.brand.id,
                                price: product.price,
                                stock: product.stock,
                                status: product.status,
                            }}
                            brands={brands}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={isSubmitting}
                            submitLabel="Update Product"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
