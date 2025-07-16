import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { ConversationFactsField } from '@mods/assistant/types';

export const conversationFactsFieldToTitle = ((field) => {
    switch (field) {
        case 'topicsDiscussed':
            return Success('Topics');
        case 'questionsByContact':
            return Success('Questions');
        case 'requestsByContact':
            return Success('Requests');
    }

    return Error('INVALID_CONVERSATION_FACT_FIELD');
}) satisfies Function<ConversationFactsField, unknown>;
