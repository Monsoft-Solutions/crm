import { ErrorType } from '@errors/schemas/error.schema';

import { dbConnectionErrorParse } from './db-connection.error';
import { sqlParsingErrorParse } from './sql-parsing.error';
import { sqlUnknownDbErrorParse } from './sql-unknown-db.error';
import { duplicateEntryErrorParse } from './duplicate-entry.error';

export const dbErrorParse = ((error: unknown) => {
    const dbConnectionError = dbConnectionErrorParse(error);
    if (dbConnectionError)
        return {
            code: 'DB_CONNECTION',
            source: 'database:connections',
        } as const;

    const sqlParsingError = sqlParsingErrorParse(error);
    if (sqlParsingError)
        return {
            code: 'SQL_PARSING',
            message: JSON.stringify({
                sql: sqlParsingError.sql,
                sqlState: sqlParsingError.sqlState,
                sqlMessage: sqlParsingError.sqlMessage,
            }),
            source: 'database:sql-parsing',
        } as const;

    const sqlUnknownDbError = sqlUnknownDbErrorParse(error);
    if (sqlUnknownDbError)
        return {
            code: 'SQL_UNKNOWN_DB',
            message: JSON.stringify({
                sqlState: sqlUnknownDbError.sqlState,
                sqlMessage: sqlUnknownDbError.sqlMessage,
            }),
            source: 'database:unknown-db',
        } as const;

    const duplicateEntryError = duplicateEntryErrorParse(error);
    if (duplicateEntryError)
        return {
            code: 'DUPLICATE_ENTRY',
            message: JSON.stringify({
                sql: duplicateEntryError.sql,
                sqlState: duplicateEntryError.sqlState,
                sqlMessage: duplicateEntryError.sqlMessage,
            }),
            source: 'database:duplicate-entry',
        } as const;
}) satisfies (error: unknown) => ErrorType | undefined;
