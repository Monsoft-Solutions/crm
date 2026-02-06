import { z } from 'zod';

export const updateBrandDefaultAssistantSchema = z.object({
    brandId: z.string(),
    defaultAssistantId: z.string().nullable(),
});

export type UpdateBrandDefaultAssistant = z.infer<
    typeof updateBrandDefaultAssistantSchema
>;
