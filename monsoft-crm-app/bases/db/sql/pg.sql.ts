export {
    pgTable as table,
    boolean,
    integer as int,
    bigint,
    char,
    varchar,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';

import { Writable } from 'drizzle-orm';

export { pgEnum as enumType } from 'drizzle-orm/pg-core';

import { PgEnum } from 'drizzle-orm/pg-core';

export { drizzle, NodePgDatabase as Database } from 'drizzle-orm/node-postgres';

import pg, { PoolConfig } from 'pg';

export const sqlEnum = <U extends string, T extends Readonly<[U, ...U[]]>>(
    name: string,
    enumType: PgEnum<Writable<T>>,
) => enumType(name);

export const createPool = (config: PoolConfig) => new pg.Pool(config);

type Pool = pg.Pool;

export { type Pool };

export const dialect = 'postgresql';
