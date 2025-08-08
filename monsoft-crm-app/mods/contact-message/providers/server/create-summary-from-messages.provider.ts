import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import tables from '@db/db';

import { getContactMessages } from './get-contact-messages.provider';
import { generateSummaryContentsFromMessagesContents } from './generate-summary-contents-from-messages-contents.provider';

export const createSummaryFromMessages = (async ({
    db,
    contactId,
    from,
    to,
}) => {
    const { data: messages, error: messagesError } = await getContactMessages({
        db,
        contactId,
        from,
        to,
    });

    if (messagesError) return Error();

    const { data: summaryContent, error: summaryContentError } =
        generateSummaryContentsFromMessagesContents({
            messagesContents: messages.map((message) => message.body),
        });

    if (summaryContentError) return Error();

    const summary = {
        id: uuidv4(),
        contactId,
        summary: summaryContent,
        from,
        to,
    };

    const { error: insertSummaryError } = await catchError(
        db.insert(tables.contactMessageSummary).values(summary),
    );

    if (insertSummaryError) return Error();

    return Success();
}) satisfies Function<{ contactId: string; db: Tx; from: number; to: number }>;
