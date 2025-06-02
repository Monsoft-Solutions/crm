import { endpoints } from '@api/providers/server';

// queries
import { getContactEmails } from './get-contact-emails.query';
import { getContactMessages } from './get-contact-messages.query';

// mutations
import { sendEmailToContact } from './send-email-to-contact.mutation';
import { sendSmsToContactPhoneNumber } from './send-sms-to-contact-phone-number.mutation';
import { sendMessageToContact } from './send-message-to-contact.mutation';

// subscriptions

export const contactMessage = endpoints({
    // queries
    getContactEmails,
    getContactMessages,

    // mutations
    sendEmailToContact,
    sendSmsToContactPhoneNumber,
    sendMessageToContact,

    // subscriptions
});
