import { vanillaApi } from './vanilla-api.provider';

import { trpcReact } from './trpc-react.provider';

import { Api } from '@api/types/web/api.type';

import { createRpcProxy, getApiRequestTypeFromMethod } from '@api/utils';

export const api = createRpcProxy((path, args) => {
    const type = getApiRequestTypeFromMethod(path.at(-1) ?? '');

    if (type === 'unknown') throw new Error('Unknown api request type');

    let aux: unknown = type === 'mutation' ? vanillaApi : trpcReact;

    for (const p of path) {
        aux = (aux as Record<string, unknown>)[p];
    }

    const method = aux as (...args: unknown[]) => unknown;

    const response = method(...args);

    if (type === 'mutation') return response;

    const dataAndError = (
        response as {
            data?: {
                data: unknown;
                error: unknown;
            };
        }
    ).data;

    if (dataAndError === undefined)
        return {
            data: undefined,
            error: undefined,
            isLoading: true,
        };

    const { data, error } = dataAndError;

    return {
        data,
        error,
        isLoading: false,
    };
}) as unknown as Api;
