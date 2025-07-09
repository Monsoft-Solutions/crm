import { ProductStockStatus } from '../enums';

export const productStockStatusToLabel = (status: ProductStockStatus) => {
    switch (status) {
        case 'out_of_stock':
            return 'Out of Stock';

        case 'low_stock':
            return 'Low Stock';

        case 'in_stock':
            return 'In Stock';
    }
};
