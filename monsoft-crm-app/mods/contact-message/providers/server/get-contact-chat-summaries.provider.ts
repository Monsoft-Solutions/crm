import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { eq, asc } from 'drizzle-orm';
import tables from '@db/db';

export const getContactChatSummaries = (async ({ contactId, db }) => {
    const {
        data: contactMessagesSummaries,
        error: contactMessagesSummariesError,
    } = await catchError(
        db.query.contactMessageSummary.findMany({
            where: eq(tables.contactMessageSummary.contactId, contactId),

            orderBy: asc(tables.contactMessageSummary.from),
        }),
    );

    if (contactMessagesSummariesError) return Error();

    return Success(contactMessagesSummaries);
}) satisfies Function<
    { contactId: string; db: Tx },
    {
        id: string;
        summary: string;
        from: number;
        to: number;
    }[]
>;
