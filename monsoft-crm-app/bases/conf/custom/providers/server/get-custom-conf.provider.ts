import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { serverQueryClient } from '@api/providers/server';
import { getCustomConfQueryKey } from '@conf/custom/utils';
import { CustomConf, customConfWithErrorSchema } from '@conf/custom/schemas';

import { getCustomConfFromDb } from './get-custom-conf-from-db.provider';

// Get Custom configuration
export const getCustomConf = (async ({ organizationId }) => {
    const cache = await serverQueryClient.ensureQueryData({
        queryKey: getCustomConfQueryKey({ organizationId }),

        queryFn: () => getCustomConfFromDb({ organizationId }),

        staleTime: 10000,
        gcTime: 20000,

        revalidateIfStale: true,
    });

    const parsingCache = customConfWithErrorSchema.safeParse(cache);

    if (!parsingCache.success) return Error('PARSING_CACHE');

    const { data: cacheData, error: cacheError } = cache;

    if (cacheError) return Error('CACHE_ERROR');

    return Success(cacheData);
}) satisfies Function<{ organizationId: string }, CustomConf>;
