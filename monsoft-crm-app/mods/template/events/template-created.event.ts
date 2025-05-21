import { z } from 'zod';

import { templateStatusEnum } from '../enums/template-status.enum';

// template-created event schema
export const templateCreated = z.object({
    id: z.string(),
    name: z.string(),
    creator: z.string(),
    status: templateStatusEnum,
});

// template-created event type
export type TemplateCreatedEvent = z.infer<typeof templateCreated>;
