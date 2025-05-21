import { Return } from '@errors/types';

export type QueryMutationCallback<Context, Input, Output> = (args: {
    ctx: Context;
    input: Input;
}) => Output extends Return<unknown> ? Output : never;
