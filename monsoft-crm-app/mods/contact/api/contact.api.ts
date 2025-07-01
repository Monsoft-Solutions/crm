import { endpoints } from '@api/providers/server';

// queries
import { getContactsIds } from './get-contacts-ids.query';
import { getContact } from './get-contact.query';

// mutations
import { createContact } from './create-contact.mutation';
import { updateContact } from './update-contact.mutation';

// subscriptions
import { onNewContact } from './new-contact.subscription';

export const contact = endpoints({
    // queries
    getContactsIds,
    getContact,

    // mutations
    createContact,
    updateContact,

    // subscriptions
    onNewContact,
});
