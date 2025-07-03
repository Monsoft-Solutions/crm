import { Return } from '@errors/types';

export type QueryMutationCallback<
    Context,
    Input,
    Output,
    AdditionalArgs = unknown,
> = (
    args: {
        ctx: Context;
        input: Input;
    } & AdditionalArgs,
) => Output extends Return<unknown> ? Output : never;
