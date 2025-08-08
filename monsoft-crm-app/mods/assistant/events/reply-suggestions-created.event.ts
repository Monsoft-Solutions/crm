import { z } from 'zod';

export const replySuggestionsCreated = z.object({
    messageId: z.string(),
});

export type replySuggestionsCreated = z.infer<typeof replySuggestionsCreated>;
