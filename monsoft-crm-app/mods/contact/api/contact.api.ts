import { endpoints } from '@api/providers/server';

// queries
import { getContactsIds } from './get-contacts-ids.query';
import { getContact } from './get-contact.query';

// mutations
import { createContact } from './create-contact.mutation';

// subscriptions

export const contact = endpoints({
    // queries
    getContactsIds,
    getContact,

    // mutations
    createContact,

    // subscriptions
});
