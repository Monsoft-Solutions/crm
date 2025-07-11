import { Function } from '@errors/types';
import { Success, Error } from '@errors/utils';

export const generateSummaryContentsFromMessagesContents = (({
    messagesContents,
}) => {
    if (messagesContents.length === 0) return Error();

    // TODO: implement actual summary generation using AI
    const summaryContent = messagesContents.join('\n');

    return Success(summaryContent);
}) satisfies Function<{ messagesContents: string[] }, string>;
