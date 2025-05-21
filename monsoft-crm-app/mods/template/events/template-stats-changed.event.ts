import { z } from 'zod';

import { templatesStatsSchema } from '../schemas';

// template-stats-changed event schema
export const templateStatsChanged = templatesStatsSchema;

// template-stats-changed event type
export type TemplateStatsChangedEvent = z.infer<typeof templateStatsChanged>;
