import { QueryMutationCallback } from '@api/types/server/query-mutation-callback.type';

// utility to create a tRPC query/mutation
export const queryMutationCallback = <Context, Input, Output>(
    callback: QueryMutationCallback<Context, Input, Output>,
) => callback;
