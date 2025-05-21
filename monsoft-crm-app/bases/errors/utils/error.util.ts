import { SyncReturn } from '@errors/types';

import { defaultErrorCode } from '@errors/constants';

export function Error(name?: undefined): {
    data: undefined;
    error: typeof defaultErrorCode;
};
export function Error<Name>(name?: Name extends string ? Name : never): {
    data: undefined;
    error: Name;
};
export function Error<Name>(
    name?: Name extends string | undefined ? Name : never,
): SyncReturn<string | undefined> {
    const error = name ?? defaultErrorCode;

    return { data: undefined, error };
}
