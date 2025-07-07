import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { and, eq } from 'drizzle-orm';
import tables from '@db/db';

export const markAllContactInboundSmsMessagesAsRead = (async ({
    contactId,
    db,
}) => {
    const { error } = await catchError(
        db
            .update(tables.contactSmsMessage)
            .set({ status: 'read' })
            .where(
                and(
                    eq(tables.contactSmsMessage.contactId, contactId),
                    eq(tables.contactSmsMessage.direction, 'inbound'),
                ),
            ),
    );

    if (error) return Error();

    return Success();
}) satisfies Function<
    {
        contactId: string;
        db: Tx;
    },
    { id: string }
>;
