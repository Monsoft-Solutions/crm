import { z } from 'zod';

import { certaintyLevelEnum } from '../enums';

export const replySuggestionOutputSchema = z.object({
    content: z.string(),
    certaintyLevel: certaintyLevelEnum,
});

export type ReplySuggestionOutput = z.infer<typeof replySuggestionOutputSchema>;
