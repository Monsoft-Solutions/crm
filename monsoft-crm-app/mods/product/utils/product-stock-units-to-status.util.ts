import { ProductStockStatus } from '../enums';

export const productStockUnitsToStatus = (
    stock: number,
): ProductStockStatus => {
    if (stock === 0) return 'out_of_stock';

    if (stock < 10) return 'low_stock';

    return 'in_stock';
};
