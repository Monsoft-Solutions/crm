import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { Tx } from '@db/types';

import { MessageBubbleProps } from '@mods/contact-message/schemas';

import { getContactSmsMessages } from './get-contact-sms-messages.provider';
import { getContactWhatsappMessages } from './get-contact-whatsapp-messages.provider';
import { getContactEmailMessages } from './get-contact-email-messages.provider';

export const getContactMessages = (async ({ db, contactId, from, to }) => {
    const { data: contactSmsMessages, error: contactSmsMessagesError } =
        await getContactSmsMessages({
            contactId,
            db,
            from,
            to,
        });

    if (contactSmsMessagesError) return Error();

    const {
        data: contactWhatsappMessages,
        error: contactWhatsappMessagesError,
    } = await getContactWhatsappMessages({
        contactId,
        db,
        from,
        to,
    });

    if (contactWhatsappMessagesError) return Error();

    const { data: contactEmailMessages, error: contactEmailMessagesError } =
        await getContactEmailMessages({
            contactId,
            db,
            from,
            to,
        });

    if (contactEmailMessagesError) return Error();

    const messages = [
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

    const messagesSorted = messages.sort((a, b) => a.createdAt - b.createdAt);

    return Success(messagesSorted);
}) satisfies Function<
    { contactId: string; db: Tx; from?: number; to?: number },
    MessageBubbleProps[]
>;
