import { z } from 'zod';

export const sqlUnknownDbErrorSchema = z.object({
    code: z.literal('ER_BAD_DB_ERROR'),
    sqlState: z.string(),
    sqlMessage: z.string(),
});

export type sqlUnknownDbError = z.infer<typeof sqlUnknownDbErrorSchema>;

export const sqlUnknownDbErrorParse = (error: unknown) => {
    return sqlUnknownDbErrorSchema.safeParse(error).data;
};
