import { endpoints } from '@api/providers/server';

// queries
import { getContactSummary } from './get-contact-summary.query';
import { getContactEmails } from './get-contact-emails.query';
import { getContactMessages } from './get-contact-messages.query';

// mutations
import { sendSmsToContactPhoneNumber } from './send-sms-to-contact-phone-number.mutation';
import { sendMessageToContact } from './send-message-to-contact.mutation';

// subscriptions
import { onNewContactMessage } from './new-contact-message.subscription';
import { onContactMessageStatusUpdated } from './contact-message-status-updated.subscription';

export const contactMessage = endpoints({
    // queries
    getContactSummary,
    getContactEmails,
    getContactMessages,

    // mutations
    sendSmsToContactPhoneNumber,
    sendMessageToContact,

    // subscriptions
    onNewContactMessage,
    onContactMessageStatusUpdated,
});
