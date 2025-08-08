import { z } from 'zod';

export const industryEnum = z.enum([
    'technology',
    'healthcare',
    'finance',
    'education',
    'retail',
    'manufacturing',
    'construction',
    'transportation',
    'hospitality',
    'media',
    'consulting',
    'real_estate',
    'agriculture',
    'energy',
    'telecommunications',
    'automotive',
    'legal',
    'non_profit',
    'government',
    'other',
]);

export type Industry = z.infer<typeof industryEnum>;
