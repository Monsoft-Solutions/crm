import { endpoints } from '@api/providers/server';

// queries
import { getBrand } from './get-brand.query';
import { getBrandsIds } from './get-brands-ids.query';
import { getAvailablePhoneNumbers } from './get-available-phone-numbers.query';

// mutations
import { createBrand } from './create-brand.mutation';

// subscriptions

export const brand = endpoints({
    // queries
    getBrand,
    getBrandsIds,
    getAvailablePhoneNumbers,

    // mutations
    createBrand,

    // subscriptions
});
