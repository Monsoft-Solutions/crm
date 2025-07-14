import { endpoints } from '@api/providers/server';

// queries

// mutations
import { askAssistant } from './ask-assistant.mutation';

// subscriptions

export const assistant = endpoints({
    // queries

    // mutations
    askAssistant,

    // subscriptions
});
