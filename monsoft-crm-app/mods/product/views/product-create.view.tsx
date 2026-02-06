import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { api } from '@api/providers/web';

import { Card, CardContent, CardHeader, CardTitle } from '@ui/card.ui';

import { PageHeader } from '@shared/components/page-header.component';

import { ProductForm } from '../components';

// view for adding a new product
export function ProductCreateView() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            const { error } = await api.product.createProduct.mutate({
                name: data.name,
                description: data.description,
                sku: data.sku,
                brandId: data.brandId,
                price: data.price,
                stock: data.stock,
            });

            if (error) {
                alert('Failed to create product. Please try again.');
                return;
            }

            // Navigate back to products list on success
            void navigate({ to: '/products' });
        } catch (error) {
            console.error('Error creating product:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        void navigate({ to: '/products' });
    };

    if (isLoadingBrands || brandsError) return;

    return (
        <div className="grow overflow-y-auto p-6">
            {/* Header */}
            <PageHeader
                title="Create New Product"
                description="Add a new product to your inventory"
                breadcrumbs={[
                    { label: 'Products', href: '/products' },
                    { label: 'Create' },
                ]}
            />

            {/* Form */}
            <div className="max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProductForm
                            brands={brands}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={isSubmitting}
                            submitLabel="Create Product"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
