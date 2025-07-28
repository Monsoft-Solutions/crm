import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';
import { ContactChannelType } from '@mods/contact-channel/enums';

export const getContactMessage = (async ({ db, messageId }) => {
    const { data: whatsappMessage, error: whatsappMessageError } =
        await catchError(
            db.query.contactWhatsappMessage.findFirst({
                where: (record, { eq }) => eq(record.id, messageId),
            }),
        );

    if (whatsappMessageError) return Error();

    if (whatsappMessage)
        return Success({
            id: whatsappMessage.id,
            contactId: whatsappMessage.contactId,
            body: whatsappMessage.body,
            channelType: 'whatsapp',
        });

    const { data: smsMessage, error: smsMessageError } = await catchError(
        db.query.contactSmsMessage.findFirst({
            where: (record, { eq }) => eq(record.id, messageId),
        }),
    );

    if (smsMessageError) return Error();

    if (smsMessage)
        return Success({
            id: smsMessage.id,
            contactId: smsMessage.contactId,
            body: smsMessage.body,
            channelType: 'sms',
        });

    const { data: emailMessage, error: emailMessageError } = await catchError(
        db.query.contactEmail.findFirst({
            where: (record, { eq }) => eq(record.id, messageId),
        }),
    );

    if (emailMessageError) return Error();

    if (emailMessage)
        return Success({
            id: emailMessage.id,
            contactId: emailMessage.contactId,
            body: emailMessage.body,
            channelType: 'email',
        });

    return Error('MESSAGE_NOT_FOUND');
}) satisfies Function<
    { db: Tx; messageId: string },
    {
        id: string;
        body: string;
        channelType: ContactChannelType;
    }
>;
