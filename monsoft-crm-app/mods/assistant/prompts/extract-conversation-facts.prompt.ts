import { Function } from '@errors/types';
import { Success } from '@errors/utils';

export const extractConversationFactsPrompt = (() => {
    const systemPrompt = `
    You are a helpful assistant that extracts conversation facts from a list of messages.
    `;

    return Success(systemPrompt);
}) satisfies Function<void, string>;
