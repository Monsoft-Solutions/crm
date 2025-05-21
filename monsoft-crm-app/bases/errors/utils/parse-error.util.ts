import { ErrorType } from '@errors/schemas/error.schema';

import { dbErrorParse } from '@db/errors/db.error';

import { defaultErrorCode } from '@errors/constants';

export const parseError = ((error: unknown) => {
    // First try the existing database error parser

    const dbError = dbErrorParse(error);
    if (dbError) return dbError;

    // Handle standard Error objects
    if (error instanceof Error) {
        return {
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
            source: error.stack ? error.stack.split('\n')[0] : 'unknown',
        };
    }

    // Unknown errors
    const unknownError = {
        code: defaultErrorCode,
        message: typeof error === 'string' ? error : JSON.stringify(error),
        source: 'unknown',
    } as const;

    return unknownError;
}) satisfies (error: unknown) => ErrorType;
