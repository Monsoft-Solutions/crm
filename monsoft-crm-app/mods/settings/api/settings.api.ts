import { endpoints } from '@api/providers/server';

// queries
import { getTwilioCredentials } from './get-twilio-credentials.query';
import { getOwnedPhoneNumbers } from './get-owned-phone-numbers.query';
import { searchAvailablePhoneNumbers } from './search-available-numbers.query';
import { getWhatsappNumbers } from './get-whatsapp-numbers.query';

// mutations
import { updateTwilioCredentials } from './update-twilio-credentials.mutation';
import { testTwilioConnection } from './test-twilio-connection.mutation';
import { assignPhoneNumberBrand } from './assign-phone-number-brand.mutation';
import { setDefaultBrandPhoneNumber } from './set-default-brand-phone-number.mutation';
import { purchasePhoneNumber } from './purchase-phone-number.mutation';
import { registerWhatsappSender } from './register-whatsapp-sender.mutation';
import { assignWhatsappNumberBrand } from './assign-whatsapp-number-brand.mutation';
import { setDefaultBrandWhatsappNumber } from './set-default-brand-whatsapp-number.mutation';

// subscriptions

export const settings = endpoints({
    // queries
    getTwilioCredentials,
    getOwnedPhoneNumbers,
    searchAvailablePhoneNumbers,
    getWhatsappNumbers,

    // mutations
    updateTwilioCredentials,
    testTwilioConnection,
    assignPhoneNumberBrand,
    setDefaultBrandPhoneNumber,
    purchasePhoneNumber,
    registerWhatsappSender,
    assignWhatsappNumberBrand,
    setDefaultBrandWhatsappNumber,

    // subscriptions
});
