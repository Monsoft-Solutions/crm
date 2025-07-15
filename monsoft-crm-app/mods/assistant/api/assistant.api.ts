import { endpoints } from '@api/providers/server';

// queries
import { getReplySuggestions } from './get-reply-suggestions.query';

// mutations
import { askAssistant } from './ask-assistant.mutation';

// subscriptions
import { onReplySuggestionsCreated } from './reply-suggestions-created.subscription';

export const assistant = endpoints({
    // queries
    getReplySuggestions,

    // mutations
    askAssistant,

    // subscriptions
    onReplySuggestionsCreated,
});
