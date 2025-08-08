import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { ConversationFactsField } from '@mods/assistant/types';

import { User, MessageCircleQuestion, ShoppingCart } from 'lucide-react';

export const conversationFactsFieldToIcon = ((field) => {
    switch (field) {
        case 'topicsDiscussed':
            return Success(User);
        case 'questionsByContact':
            return Success(MessageCircleQuestion);
        case 'requestsByContact':
            return Success(ShoppingCart);
    }

    return Error('INVALID_CONVERSATION_FACT_FIELD');
}) satisfies Function<ConversationFactsField, unknown>;
