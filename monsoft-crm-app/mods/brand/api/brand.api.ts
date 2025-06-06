import { endpoints } from '@api/providers/server';

// queries
import { getBrand } from './get-brand.query';
import { getBrandsIds } from './get-brands-ids.query';

// mutations
import { createBrand } from './create-brand.mutation';

// subscriptions

export const brand = endpoints({
    // queries
    getBrand,
    getBrandsIds,

    // mutations
    createBrand,

    // subscriptions
});
