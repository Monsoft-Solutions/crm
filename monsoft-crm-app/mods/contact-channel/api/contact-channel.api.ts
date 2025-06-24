import { endpoints } from '@api/providers/server';

// queries
import { getAvailableContactChannels } from './get-available-contact-channels.query';
import { getContactEmailAddresses } from './get-contact-email-addresses.query';

// mutations
import { addContactEmailAddress } from './add-contact-email-address.mutation';

// subscriptions

export const contactChannel = endpoints({
    // queries
    getContactEmailAddresses,
    getAvailableContactChannels,

    // mutations
    addContactEmailAddress,

    // subscriptions
});
