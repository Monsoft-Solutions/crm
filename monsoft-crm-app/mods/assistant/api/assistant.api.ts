import { endpoints } from '@api/providers/server';

// queries
import { getReplySuggestions } from './get-reply-suggestions.query';
import { getConversationFacts } from './get-conversation-facts.query';
import { getBrandAssistantsIds } from './get-brand-assistants-ids.query';

// mutations
import { askAssistant } from './ask-assistant.mutation';
import { extractConversationFacts } from './extract-conversation-facts.mutation';

// subscriptions
import { onReplySuggestionsCreated } from './reply-suggestions-created.subscription';

export const assistant = endpoints({
    // queries
    getReplySuggestions,
    getConversationFacts,
    getBrandAssistantsIds,

    // mutations
    askAssistant,
    extractConversationFacts,

    // subscriptions
    onReplySuggestionsCreated,
});
