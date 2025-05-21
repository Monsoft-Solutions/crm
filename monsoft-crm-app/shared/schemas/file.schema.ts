import { z } from 'zod';

export const fileSchema = z.object({
    name: z.string(),
    type: z.string(),
    base64: z.string(),
});

export type File = z.infer<typeof fileSchema>;
