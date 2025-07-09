import { ReactElement } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { toast } from 'sonner';

import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';

import { fmtCurrencyAmount } from '@shared/utils/number';

import { Button } from '@ui/button.ui';
import { Badge } from '@ui/badge.ui';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@ui/card.ui';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@ui/dropdown-menu.ui';

import { ProductStatus } from '../enums';

import { api, apiClientUtils } from '@api/providers/web';

type ProductCardProps = {
    product: {
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
    };
};

// card component for displaying a product in a list
export function ProductCard({ product }: ProductCardProps): ReactElement {
    const navigate = useNavigate();

    const handleViewProduct = (productId: string) => {
        void navigate({
            to: '/products/$id',
            params: { id: productId },
        });
    };

    const handleEditProduct = (productId: string) => {
        void navigate({
            to: '/products/$id/edit',
            params: { id: productId },
        });
    };

    const handleDeleteProduct = async (productId: string) => {
        const { error } = await api.product.deleteProduct.mutate({
            id: productId,
        });

        if (error) {
            toast.error('Failed to delete product. Please try again.');
            return;
        }

        void apiClientUtils.product.getProducts.invalidate();
    };

    return (
        <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">
                            {product.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                            SKU: {product.sku}
                        </CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    handleViewProduct(product.id);
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    handleEditProduct(product.id);
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    void handleDeleteProduct(product.id);
                                }}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                <div className="space-y-3">
                    {product.description && (
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                            {product.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-2xl font-bold">
                                {fmtCurrencyAmount(product.price)}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Stock: {product.stock}
                            </p>
                        </div>

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

                    <div className="border-t pt-2">
                        <p className="text-muted-foreground text-sm">
                            Brand:{' '}
                            <span className="font-medium">
                                {product.brand.name}
                            </span>
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                        handleViewProduct(product.id);
                    }}
                >
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
}
