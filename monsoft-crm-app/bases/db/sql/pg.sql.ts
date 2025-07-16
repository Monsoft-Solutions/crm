import { sql, Writable } from 'drizzle-orm';

export {
    pgTable as table,
    boolean,
    integer as int,
    char,
    varchar,
    text,
    jsonb as json,
} from 'drizzle-orm/pg-core';

import { bigint } from 'drizzle-orm/pg-core';

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

export const timestamp = (name: string) =>
    bigint(name, {
        mode: 'number',
    }).default(sql`(EXTRACT(EPOCH FROM now()) * 1000)::bigint`);
