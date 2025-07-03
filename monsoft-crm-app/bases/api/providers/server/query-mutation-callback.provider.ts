import { QueryMutationCallback } from '@api/types/server/query-mutation-callback.type';

import { Success, Error } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { db } from '@db/providers/server';

// utility to create a tRPC query/mutation
export const queryMutationCallback = <Context, Input, Output>(
    callback: QueryMutationCallback<Context, Input, Output, { db: Tx }>,
) => {
    return (async (args: { ctx: Context; input: Input }) => {
        const { data, error } = await catchError(
            db.transaction(async (db) => {
                const { data, error } = await callback({ ...args, db });

                if (error) throw error;

                return data;
            }),
        );

        if (error) return Error(error);

        return Success(data);
    }) as QueryMutationCallback<Context, Input, Output>;
};
