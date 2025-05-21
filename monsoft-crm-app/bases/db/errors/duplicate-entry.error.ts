import { z } from 'zod';

export const duplicateEntryErrorSchema = z.object({
    code: z.literal('ER_DUP_ENTRY'),
    sql: z.string(),
    sqlState: z.string(),
    sqlMessage: z.string(),
});

export type duplicateEntryError = z.infer<typeof duplicateEntryErrorSchema>;

export const duplicateEntryErrorParse = (error: unknown) => {
    return duplicateEntryErrorSchema.safeParse(error).data;
};
