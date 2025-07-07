import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { ContactEvent } from '@mods/contact/enums';

export const getContactLastEvent = (async ({ contactId, db }) => {
    const { error, data: contact } = await catchError(
        db.query.contact.findFirst({
            columns: {
                id: true,
                createdAt: true,
            },

            where: (record, { eq }) => eq(record.id, contactId),

            with: {
                smsMessages: {
                    orderBy: (record, { desc }) => desc(record.createdAt),
                    limit: 1,
                },

                whatsappMessages: {
                    orderBy: (record, { desc }) => desc(record.createdAt),
                    limit: 1,
                },
            },
        }),
    );

    if (error) return Error();

    if (!contact) return Error('CONTACT_NOT_FOUND');

    const messages = [...contact.smsMessages, ...contact.whatsappMessages];

    const messagesSorted = messages.sort((a, b) => b.createdAt - a.createdAt);

    const lastMessage = messagesSorted.at(0);

    if (lastMessage) {
        return Success({
            type: 'message',
            timestamp: lastMessage.createdAt,
            message: lastMessage,
        });
    }

    return Success({
        type: 'created',
        timestamp: contact.createdAt,
    });
}) satisfies Function<{ contactId: string; db: Tx }, ContactEvent>;
