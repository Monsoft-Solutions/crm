import { endpoints } from '@api/providers/server';

// queries
import { getProducts } from './get-products.query';
import { getProduct } from './get-product.query';

// mutations
import { createProduct } from './create-product.mutation';
import { updateProduct } from './update-product.mutation';
import { deleteProduct } from './delete-product.mutation';
import { addProductImage } from './add-product-image.mutation';
import { setMainProductImage } from './set-main-product-image.mutation';
import { deleteProductImage } from './delete-product-image.mutation';

export const product = endpoints({
    // queries
    getProducts,
    getProduct,

    // mutations
    createProduct,
    updateProduct,
    deleteProduct,
    addProductImage,
    setMainProductImage,
    deleteProductImage,
});
