import { endpoints } from '@api/providers/server';

// queries
import { getContact } from './get-contact.query';

// mutations
import { createContact } from './create-contact.mutation';

// subscriptions

export const contact = endpoints({
    // queries
    getContact,

    // mutations
    createContact,

    // subscriptions
});
