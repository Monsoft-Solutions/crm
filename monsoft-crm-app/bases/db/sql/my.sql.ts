export {
    mysqlTable as table,
    boolean,
    bigint,
    char,
    varchar,
    text,
    mysqlEnum as sqlEnum,
} from 'drizzle-orm/mysql-core';

import { Writable } from 'drizzle-orm';

export { drizzle, MySql2Database as Database } from 'drizzle-orm/mysql2';

export { createPool, type Pool } from 'mysql2';

export const enumType = <U extends string, T extends Readonly<[U, ...U[]]>>(
    enumName: string,
    values: T | Writable<T>,
) => values;

export const dialect = 'mysql';
