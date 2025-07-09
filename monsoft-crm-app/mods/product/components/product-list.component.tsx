import { ReactElement } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { Button } from '@ui/button.ui';

import { Card, CardContent } from '@ui/card.ui';

import { Plus } from 'lucide-react';

import { ProductStatus } from '../enums';

import { ProductCard } from './product-card.component';

type ProductListProps = {
    products: {
        id: string;
        name: string;
        description?: string | null;
        sku: string;
        price: number;
        stock: number;
        status: ProductStatus;
        brand: {
            id: string;
            name: string;
        };
    }[];
};

export function ProductList({ products }: ProductListProps): ReactElement {
    const navigate = useNavigate();

    const handleCreateProduct = () => {
        void navigate({ to: '/products/new' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Products</h2>

                <Button onClick={handleCreateProduct}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            No products found. Try adjusting your filters or
                            create a new product.
                        </p>
                        <Button onClick={handleCreateProduct} className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Product
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
