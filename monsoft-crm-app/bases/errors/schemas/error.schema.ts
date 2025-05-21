import { z } from 'zod';

export type ErrorCode =
    // Database errors
    | 'DB_CONNECTION'
    | 'SQL_PARSING'
    | 'SQL_UNKNOWN_DB'
    | 'DUPLICATE_ENTRY'
    // General application errors
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'VALIDATION_ERROR'
    | 'INTERNAL_SERVER_ERROR'
    | 'NOT_FOUND'
    | 'BAD_REQUEST'
    | 'UNKNOWN';

export const errorSchema = z.object({
    code: z.custom<ErrorCode>(),
    message: z.string().optional(),
    source: z.string().optional(),
});

export type ErrorType = z.infer<typeof errorSchema>;
