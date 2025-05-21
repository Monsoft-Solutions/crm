import { z } from 'zod';

export const sqlParsingErrorSchema = z.object({
    code: z.literal('ER_PARSE_ERROR'),
    sql: z.string(),
    sqlState: z.string(),
    sqlMessage: z.string(),
});

export type sqlParsingError = z.infer<typeof sqlParsingErrorSchema>;

export const sqlParsingErrorParse = (error: unknown) => {
    return sqlParsingErrorSchema.safeParse(error).data;
};
