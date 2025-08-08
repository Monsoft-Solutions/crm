import { and, asc, InferSelectModel } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { contactWhatsappMessage } from '@db/db';

export const getContactWhatsappMessages = (async ({
    db,
    contactId,
    from,
    to,
}) => {
    const { data: whatsappMessages, error: whatsappMessagesError } =
        await catchError(
            db.query.contactWhatsappMessage.findMany({
                where: (record, { eq, gte, lt }) =>
                    and(
                        eq(record.contactId, contactId),
                        from ? gte(record.createdAt, from) : undefined,
                        to ? lt(record.createdAt, to) : undefined,
                    ),

                orderBy: asc(contactWhatsappMessage.createdAt),
            }),
        );

    if (whatsappMessagesError) return Error();

    return Success(whatsappMessages);
}) satisfies Function<
    { contactId: string; db: Tx; from?: number; to?: number },
    InferSelectModel<typeof contactWhatsappMessage>[]
>;
