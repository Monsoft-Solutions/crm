import { z } from 'zod';

// add-template form schema
export const addTemplateFormSchema = z.object({
    name: z.string().min(1),
});

// add-template form type
export type AddTemplateForm = z.infer<typeof addTemplateFormSchema>;
