import { endpoints } from '@api/providers/server';

// queries
import { getContactPhoneNumbers } from './get-contact-phone-numbers.query';
import { getAvailableContactChannels } from './get-available-contact-channels.query';
import { getContactEmailAddresses } from './get-contact-email-addresses.query';

// mutations
import { addContactEmailAddress } from './add-contact-email-address.mutation';
import { addContactPhoneNumber } from './add-contact-phone-number.mutation';

// subscriptions

export const contactChannel = endpoints({
    // queries
    getContactPhoneNumbers,
    getContactEmailAddresses,
    getAvailableContactChannels,

    // mutations
    addContactEmailAddress,
    addContactPhoneNumber,

    // subscriptions
});
