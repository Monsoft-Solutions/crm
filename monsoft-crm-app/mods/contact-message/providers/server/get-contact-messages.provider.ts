import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { MessageBubbleProps } from '@mods/contact-message/schemas';

import { getContactSmsMessages } from './get-contact-sms-messages.provider';

export const getContactMessages = (async ({ contactId }) => {
    const { data: contactSmsMessages, error: contactSmsMessagesError } =
        await getContactSmsMessages({
            contactId,
        });

    if (contactSmsMessagesError) return Error();

    const smsMessages = [
        ...(contactSmsMessages.map((message) => ({
            ...message,
            channelType: 'sms',
        })) as MessageBubbleProps[]),
    ];

    return Success(smsMessages);
}) satisfies Function<{ contactId: string }, MessageBubbleProps[]>;
