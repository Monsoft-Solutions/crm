import { relations } from 'drizzle-orm';

import { table, text } from '@db/sql';

export const brandVoice = table('brand_voice', {
    id: text('id').primaryKey(),

    // Core brand values that guide decisions and messaging
    coreValues: text('core_values'),

    // Brand personality traits (e.g. innovative, trustworthy, playful)
    personalityTraits: text('personality_traits'),

    // Preferred communication style (direct, storytelling, data-driven)
    communicationStyle: text('communication_style'),

    // Language and localization preferences
    languagePreferences: text('language_preferences'),

    // Tone of voice guidelines
    voiceGuidelines: text('voice_guidelines'),

    // Words, phrases or topics to avoid
    prohibitedContent: text('prohibited_content'),
});

export const brandVoiceRelations = relations(
    brandVoice,

    () => ({}),
);
