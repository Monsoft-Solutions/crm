import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';
import { ContactChannelType } from '@mods/contact-channel/enums';

export const getContactMessage = (async ({ db, messageId }) => {
    const { data: message, error: messageError } = await catchError(
        db.query.contactMessage.findFirst({
            where: (record, { eq }) => eq(record.id, messageId),
        }),
    );

    if (messageError) return Error();
    if (!message) return Error('MESSAGE_NOT_FOUND');

    return Success({
        id: message.id,
        contactId: message.contactId,
        body: message.body,
        channelType: message.channel,
    });
}) satisfies Function<
    { db: Tx; messageId: string },
    {
        id: string;
        body: string;
        channelType: ContactChannelType;
    }
>;
