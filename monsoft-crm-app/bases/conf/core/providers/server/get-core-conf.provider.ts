import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { serverQueryClient } from '@api/providers/server';
import { coreConfQueryKey } from '@conf/core/constants';
import { CoreConf, coreConfWithErrorSchema } from '@conf/core/schemas';

import { getCoreConfFromDb } from './get-core-conf-from-db.provider';

// Get core configuration
export const getCoreConf = (async () => {
    const cache = await serverQueryClient.ensureQueryData({
        queryKey: coreConfQueryKey,

        queryFn: getCoreConfFromDb,

        staleTime: 10000,
        gcTime: 20000,

        revalidateIfStale: true,
    });

    const parsingCache = coreConfWithErrorSchema.safeParse(cache);

    if (!parsingCache.success) return Error('PARSING_CACHE');

    const { data: cacheData, error: cacheError } = cache;

    if (cacheError) return Error('CACHE_ERROR');

    return Success(cacheData);
}) satisfies Function<void, CoreConf>;
