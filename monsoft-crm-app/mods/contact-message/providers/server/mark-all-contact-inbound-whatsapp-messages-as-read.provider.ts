import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { and, eq } from 'drizzle-orm';
import tables from '@db/db';

export const markAllContactInboundWhatsappMessagesAsRead = (async ({
    contactId,
    db,
}) => {
    const { error } = await catchError(
        db
            .update(tables.contactWhatsappMessage)
            .set({ status: 'read' })
            .where(
                and(
                    eq(tables.contactWhatsappMessage.contactId, contactId),
                    eq(tables.contactWhatsappMessage.direction, 'inbound'),
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
