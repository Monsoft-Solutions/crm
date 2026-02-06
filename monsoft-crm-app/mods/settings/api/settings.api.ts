import { endpoints } from '@api/providers/server';

// queries
import { getTwilioCredentials } from './get-twilio-credentials.query';
import { getOwnedPhoneNumbers } from './get-owned-phone-numbers.query';

// mutations
import { updateTwilioCredentials } from './update-twilio-credentials.mutation';
import { testTwilioConnection } from './test-twilio-connection.mutation';
import { assignPhoneNumberBrand } from './assign-phone-number-brand.mutation';
import { setDefaultBrandPhoneNumber } from './set-default-brand-phone-number.mutation';

// subscriptions

export const settings = endpoints({
    // queries
    getTwilioCredentials,
    getOwnedPhoneNumbers,

    // mutations
    updateTwilioCredentials,
    testTwilioConnection,
    assignPhoneNumberBrand,
    setDefaultBrandPhoneNumber,

    // subscriptions
});
