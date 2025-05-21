import { z } from 'zod';

import { templateStatusEnum } from '../enums/template-status.enum';

// template-status-updated event schema
export const templateStatusUpdated = z.object({
    id: z.string(),
    status: templateStatusEnum,
});

// template-status-updated event type
export type TemplateStatusUpdatedEvent = z.infer<typeof templateStatusUpdated>;
