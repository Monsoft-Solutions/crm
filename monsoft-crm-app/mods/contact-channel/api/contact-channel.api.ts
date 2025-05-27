import { endpoints } from '@api/providers/server';

// queries
import { getContactEmailAddresses } from './get-contact-email-addresses.query';

// mutations
import { addContactEmailAddress } from './add-contact-email-address.mutation';

// subscriptions

export const contactChannel = endpoints({
    // queries
    getContactEmailAddresses,

    // mutations
    addContactEmailAddress,

    // subscriptions
});
