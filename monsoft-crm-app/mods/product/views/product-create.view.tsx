import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { api } from '@api/providers/web';

import { Card, CardContent, CardHeader, CardTitle } from '@ui/card.ui';
import { Button } from '@ui/button.ui';

import { ArrowLeft } from 'lucide-react';

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
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <div className="mb-4 flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Products
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">
                            Create New Product
                        </h1>
                        <p className="text-muted-foreground">
                            Add a new product to your inventory
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
