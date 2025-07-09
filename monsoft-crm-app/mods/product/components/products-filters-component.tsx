import { Search } from 'lucide-react';

import { Button } from '@shared/ui/button.ui';
import { Input } from '@shared/ui/input.ui';

import { Card, CardContent } from '@shared/ui/card.ui';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/ui/select.ui';

import { ProductStatus, productStatusEnum } from '../enums';

type ProductsFiltersComponentProps = {
    brands: {
        id: string;
        name: string;
    }[];
    search: string | undefined;
    onUpdateSearchFilter: (search: string | undefined) => Promise<void>;
    brandId: string | undefined;
    onUpdateBrandFilter: (brandId: string | undefined) => Promise<void>;
    status: ProductStatus | undefined;
    onUpdateStatusFilter: (status: ProductStatus | undefined) => Promise<void>;
};

export function ProductsFiltersComponent({
    brands,
    search,
    onUpdateSearchFilter,
    brandId,
    onUpdateBrandFilter,
    status,
    onUpdateStatusFilter,
}: ProductsFiltersComponentProps) {
    const handleClearFilters = () => {
        void onUpdateSearchFilter(undefined);
        void onUpdateBrandFilter(undefined);
        void onUpdateStatusFilter(undefined);
    };

    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

                        <Input
                            placeholder="Search products..."
                            value={search ?? ''}
                            onChange={(e) => {
                                const { value } = e.target;

                                void onUpdateSearchFilter(
                                    value === '' ? undefined : value,
                                );
                            }}
                            className="pl-10"
                        />
                    </div>

                    {/* Brand Filter */}
                    <Select
                        value={brandId ?? 'all'}
                        onValueChange={(brandId) => {
                            void onUpdateBrandFilter(brandId);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Brands" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All Brands</SelectItem>
                            {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id}>
                                    {brand.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select
                        value={status ?? 'all'}
                        onValueChange={(status) => {
                            void onUpdateStatusFilter(
                                productStatusEnum.safeParse(status).data,
                            );
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>

                            {productStatusEnum.options.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Clear Filters */}
                    <Button variant="outline" onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
