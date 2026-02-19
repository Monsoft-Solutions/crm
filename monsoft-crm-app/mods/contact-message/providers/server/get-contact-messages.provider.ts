import { and, asc } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { contactMessage } from '@db/db';

import { MessageBubbleProps } from '@mods/contact-message/schemas';

export const getContactMessages = (async ({ db, contactId, from, to }) => {
    const { data: messages, error: messagesError } = await catchError(
        db.query.contactMessage.findMany({
            where: (record, { eq, gte, lt }) =>
                and(
                    eq(record.contactId, contactId),
                    from ? gte(record.createdAt, from) : undefined,
                    to ? lt(record.createdAt, to) : undefined,
                ),

            orderBy: asc(contactMessage.createdAt),
        }),
    );

    if (messagesError) return Error();

    const mapped: MessageBubbleProps[] = messages.map((message) => ({
        id: message.id,
        channelType: message.channel,
        direction: message.direction,
        subject: message.subject,
        body: message.body,
        createdAt: message.createdAt,
        status: message.status,
    }));

    return Success(mapped);
}) satisfies Function<
    { contactId: string; db: Tx; from?: number; to?: number },
    MessageBubbleProps[]
>;
