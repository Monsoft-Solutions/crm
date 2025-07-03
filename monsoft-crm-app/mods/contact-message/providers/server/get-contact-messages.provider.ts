import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { Tx } from '@db/types';

import { MessageBubbleProps } from '@mods/contact-message/schemas';

import { getContactSmsMessages } from './get-contact-sms-messages.provider';
import { getContactWhatsappMessages } from './get-contact-whatsapp-messages.provider';
import { getContactEmailMessages } from './get-contact-email-messages.provider';

export const getContactMessages = (async ({ contactId, db }) => {
    const { data: contactSmsMessages, error: contactSmsMessagesError } =
        await getContactSmsMessages({
            contactId,
            db,
        });

    if (contactSmsMessagesError) return Error();

    const {
        data: contactWhatsappMessages,
        error: contactWhatsappMessagesError,
    } = await getContactWhatsappMessages({
        contactId,
        db,
    });

    if (contactWhatsappMessagesError) return Error();

    const { data: contactEmailMessages, error: contactEmailMessagesError } =
        await getContactEmailMessages({
            contactId,
            db,
        });

    if (contactEmailMessagesError) return Error();

    const smsMessages = [
        ...(contactSmsMessages.map((message) => ({
            ...message,
            channelType: 'sms',
        })) as MessageBubbleProps[]),

        ...(contactWhatsappMessages.map((message) => ({
            ...message,
            channelType: 'whatsapp',
        })) as MessageBubbleProps[]),

        ...(contactEmailMessages.map((message) => ({
            ...message,
            channelType: 'email',
        })) as MessageBubbleProps[]),
    ];

    return Success(smsMessages);
}) satisfies Function<{ contactId: string; db: Tx }, MessageBubbleProps[]>;
