import { ReactElement } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { fmtCurrencyAmount } from '@shared/utils/number';

import { Edit, ArrowLeft, Package, DollarSign, Warehouse } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@ui/card.ui';
import { Badge } from '@ui/badge.ui';
import { Button } from '@ui/button.ui';
import { Separator } from '@ui/separator.ui';

import { productStockUnitsToStatus, productStockStatusToLabel } from '../utils';

import { ProductStatus } from '../enums';

import { ProductImageGallery } from './product-image-gallery.component';

type ProductDetailProps = {
    product: {
        id: string;
        name: string;
        description?: string | null;
        sku: string;
        price: number;
        stock: number;
        status: ProductStatus;
        createdAt: number;
        updatedAt: number;
        brand: {
            id: string;
            name: string;
        };
        images: {
            id: string;
            imageUrl: string;
            isMain: boolean;
        }[];
    };
};

const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// component for displaying full product details
export function ProductDetail({ product }: ProductDetailProps): ReactElement {
    const navigate = useNavigate();

    const handleEditProduct = () => {
        void navigate({ to: '/products/$id/edit', params: { id: product.id } });
    };

    const handleBackToProducts = () => {
        void navigate({ to: '/products' });
    };

    const stockStatus = productStockUnitsToStatus(product.stock);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBackToProducts}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Products
                        </Button>
                    }
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-muted-foreground">
                            SKU: {product.sku}
                        </p>
                    </div>
                </div>

                {
                    <Button onClick={handleEditProduct}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                }
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Product Information */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Basic Info */}
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Product Information
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        Name
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {product.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        SKU
                                    </label>
                                    <p className="font-mono">{product.sku}</p>
                                </div>

                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        Brand
                                    </label>
                                    <p>{product.brand.name}</p>
                                </div>

                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        Status
                                    </label>
                                    <div>
                                        <Badge
                                            variant={
                                                product.status === 'active'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {product.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {product.description && (
                                <>
                                    <Separator />
                                    <div>
                                        <label className="text-muted-foreground text-sm font-medium">
                                            Description
                                        </label>
                                        <p className="mt-1 whitespace-pre-wrap">
                                            {product.description}
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card className="">
                        <CardContent className="pt-6">
                            <ProductImageGallery
                                productId={product.id}
                                images={product.images}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Pricing & Inventory */}
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Pricing & Inventory
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">
                                    Price
                                </label>
                                <p className="text-2xl font-bold">
                                    {fmtCurrencyAmount(product.price)}
                                </p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">
                                        Stock
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {product.stock} units
                                    </p>
                                </div>

                                <Badge
                                    variant={
                                        stockStatus === 'out_of_stock'
                                            ? 'destructive'
                                            : stockStatus === 'low_stock'
                                              ? 'secondary'
                                              : 'default'
                                    }
                                >
                                    {productStockStatusToLabel(stockStatus)}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Warehouse className="h-5 w-5" />
                                Metadata
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-muted-foreground text-sm font-medium">
                                    Created
                                </label>
                                <p>{formatDate(product.createdAt)}</p>
                            </div>

                            <div>
                                <label className="text-muted-foreground text-sm font-medium">
                                    Last Updated
                                </label>
                                <p>{formatDate(product.updatedAt)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
