import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { Tx } from '@db/types';

import { markAllContactInboundEmailMessagesAsRead } from './mark-all-contact-inbound-email-messages-as-read.provider';
import { markAllContactInboundSmsMessagesAsRead } from './mark-all-contact-inbound-sms-messages-as-read.provider';
import { markAllContactInboundWhatsappMessagesAsRead } from './mark-all-contact-inbound-whatsapp-messages-as-read.provider';

export const markAllContactInboundMessagesAsRead = (async ({
    contactId,
    db,
}) => {
    const { error: emailError } =
        await markAllContactInboundEmailMessagesAsRead({
            contactId,
            db,
        });

    if (emailError) return Error();

    const { error: smsError } = await markAllContactInboundSmsMessagesAsRead({
        contactId,
        db,
    });

    if (smsError) return Error();

    const { error: whatsappError } =
        await markAllContactInboundWhatsappMessagesAsRead({
            contactId,
            db,
        });

    if (whatsappError) return Error();

    return Success();
}) satisfies Function<
    {
        contactId: string;
        db: Tx;
    },
    { id: string }
>;
