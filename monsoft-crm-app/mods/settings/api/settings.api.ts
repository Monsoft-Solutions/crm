import { endpoints } from '@api/providers/server';

// queries
import { getTwilioCredentials } from './get-twilio-credentials.query';
import { getOwnedPhoneNumbers } from './get-owned-phone-numbers.query';

// mutations
import { updateTwilioCredentials } from './update-twilio-credentials.mutation';
import { testTwilioConnection } from './test-twilio-connection.mutation';

// subscriptions

export const settings = endpoints({
    // queries
    getTwilioCredentials,
    getOwnedPhoneNumbers,

    // mutations
    updateTwilioCredentials,
    testTwilioConnection,

    // subscriptions
});
