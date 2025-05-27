import { endpoints } from '@api/providers/server';

// queries

// mutations
import { createBrand } from './create-brand.mutation';

// subscriptions

export const brand = endpoints({
    // queries

    // mutations
    createBrand,

    // subscriptions
});
