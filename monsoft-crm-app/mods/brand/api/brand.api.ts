import { endpoints } from '@api/providers/server';

// queries
import { getBrand } from './get-brand.query';

// mutations
import { createBrand } from './create-brand.mutation';

// subscriptions

export const brand = endpoints({
    // queries
    getBrand,

    // mutations
    createBrand,

    // subscriptions
});
