import { z } from 'zod';

// template-deleted event schema
export const templateDeleted = z.object({
    id: z.string(),
});

// template-deleted event type
export type TemplateDeletedEvent = z.infer<typeof templateDeleted>;
