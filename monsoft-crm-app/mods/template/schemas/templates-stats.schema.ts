import { z } from 'zod';

// templates-stats schema
export const templatesStatsSchema = z.object({
    numDraftTemplates: z.number(),
    numFinishedTemplates: z.number(),
    numCreators: z.number(),
});

// templates-stats type
export type TemplatesStats = z.infer<typeof templatesStatsSchema>;
