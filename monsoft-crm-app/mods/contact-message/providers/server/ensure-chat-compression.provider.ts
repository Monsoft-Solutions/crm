import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { Tx } from '@db/types';

import { getContactMessages } from './get-contact-messages.provider';
import { getContactChatSummaries } from './get-contact-chat-summaries.provider';
import { createSummaryFromMessages } from './create-summary-from-messages.provider';

// TODO: make this configurable
const MAX_NON_SUMMARIZED_MESSAGES = 2;

export const ensureChatCompression = (async ({ db, contactId }) => {
    const { data: summaries, error: summariesError } =
        await getContactChatSummaries({
            contactId,
            db,
        });

    if (summariesError) return Error();

    const lastSummary = summaries.at(-1);

    const lastSummaryTo = lastSummary?.to;

    const { data: nonSummarizedMessages, error: nonSummarizedMessagesError } =
        await getContactMessages({
            contactId,
            db,
            from: lastSummaryTo,
        });

    if (nonSummarizedMessagesError) return Error();

    if (nonSummarizedMessages.length <= MAX_NON_SUMMARIZED_MESSAGES)
        return Success();

    const firstNonSummarizedMessage = nonSummarizedMessages.at(0);
    const lastNonSummarizedMessage = nonSummarizedMessages.at(-1);

    if (!firstNonSummarizedMessage || !lastNonSummarizedMessage) return Error();

    const newSummaryFrom = firstNonSummarizedMessage.createdAt;
    const newSummaryTo = lastNonSummarizedMessage.createdAt + 1;

    const { error: newSummaryError } = await createSummaryFromMessages({
        db,
        contactId,
        from: newSummaryFrom,
        to: newSummaryTo,
    });

    if (newSummaryError) return Error();

    return Success();
}) satisfies Function<{ db: Tx; contactId: string }>;
