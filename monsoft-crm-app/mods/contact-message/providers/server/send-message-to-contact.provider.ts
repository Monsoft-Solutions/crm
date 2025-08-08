import { Error, Success } from '@errors/utils';

import { emit } from '@events/providers';

import { Tx } from '@db/types';

import { ContactChannelType } from '@mods/contact-channel/enums';

import { sendWhatsappToContact } from './send-whatsapp-to-contact.provider';
import { sendSmsToContact } from './send-sms-to-contact.provider';
import { sendEmailToContact } from './send-email-to-contact.provider';

export const sendMessageToContact = async ({
    db,
    contactId,
    channelType,
    body,
}: {
    db: Tx;
    contactId: string;
    channelType: ContactChannelType;
    body: string;
}) => {
    let id: string;

    switch (channelType) {
        case 'sms': {
            const { data: smsMessage, error } = await sendSmsToContact({
                contactId,
                body,
                db,
            });

            if (error) return Error();

            id = smsMessage.id;
            break;
        }

        case 'email': {
            const { data: emailMessage, error } = await sendEmailToContact({
                contactId,
                subject: '',
                body,
                db,
            });

            if (error) return Error();

            id = emailMessage.id;

            break;
        }

        case 'whatsapp': {
            const { data: smsMessage, error } = await sendWhatsappToContact({
                contactId,
                body,
                db,
            });

            if (error) return Error();

            id = smsMessage.id;
            break;
        }
    }

    emit({
        event: 'newContactMessage',
        payload: {
            id,
            contactId,
            channelType,
            direction: 'outbound',
            body,
            createdAt: Date.now(),
        },
    });

    return Success();
};
