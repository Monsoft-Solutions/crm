import { endpoints } from '@api/providers/server';

// queries
import { getReplySuggestions } from './get-reply-suggestions.query';
import { getConversationFacts } from './get-conversation-facts.query';
import { getBrandAssistantsIds } from './get-brand-assistants-ids.query';
import { getAssistant } from './get-assistant.query';

// mutations
import { askAssistant } from './ask-assistant.mutation';
import { extractConversationFacts } from './extract-conversation-facts.mutation';
import { createAssistant } from './create-assistant.mutation';
import { updateAssistant } from './update-assistant.mutation';
import { generateAssistantConfig } from './generate-assistant-config.mutation';
import { selectReplySuggestion } from './select-reply-suggestion.mutation';

// subscriptions
import { onReplySuggestionsCreated } from './reply-suggestions-created.subscription';

export const assistant = endpoints({
    // queries
    getReplySuggestions,
    getConversationFacts,
    getBrandAssistantsIds,
    getAssistant,

    // mutations
    askAssistant,
    extractConversationFacts,
    createAssistant,
    updateAssistant,
    generateAssistantConfig,
    selectReplySuggestion,

    // subscriptions
    onReplySuggestionsCreated,
});
