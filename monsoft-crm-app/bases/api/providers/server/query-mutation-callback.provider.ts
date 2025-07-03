import { QueryMutationCallback } from '@api/types/server/query-mutation-callback.type';

import { Success, Error } from '@errors/utils';

import { Tx } from '@db/types';

import { db } from '@db/providers/server';

// utility to create a tRPC query/mutation
export const queryMutationCallback = <Context, Input, Output>(
    callback: QueryMutationCallback<Context, Input, Output, { db: Tx }>,
) => {
    return (async (args: { ctx: Context; input: Input }) => {
        const { data, error } = await db.transaction(async (db) => {
            return callback({ ...args, db });
        });

        if (error) return Error(error);

        return Success(data);
    }) as QueryMutationCallback<Context, Input, Output>;
};
