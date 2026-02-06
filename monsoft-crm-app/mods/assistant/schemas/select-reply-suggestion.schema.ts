import { z } from 'zod';

export const selectReplySuggestionSchema = z.object({
    id: z.string(),
});

export type SelectReplySuggestion = z.infer<typeof selectReplySuggestionSchema>;
