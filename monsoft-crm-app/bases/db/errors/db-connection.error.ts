import { z } from 'zod';

export const dbConnectionErrorSchema = z.object({
    code: z.literal('ECONNREFUSED'),
});

export type dbConnectionError = z.infer<typeof dbConnectionErrorSchema>;

export const dbConnectionErrorParse = (error: unknown) => {
    return dbConnectionErrorSchema.safeParse(error).data;
};
