import { z } from 'zod';

export const bpiProviderOutputSchema = z.object({
    EUR: z.object({ last: z.number() }),
});
