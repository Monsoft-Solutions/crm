import { Function } from '@errors/types';
import { Success } from '@errors/utils';

import { serverQueryClient } from '@api/providers/server';

import { db } from '@db/providers/server';

import { CoreConf, coreConfWithErrorSchema } from '@conf/core/schemas';

import { coreConfTable } from '@conf/db';

import { coreConfQueryKey } from '@conf/core/constants';

import { getCoreConfFromDb } from './get-core-conf-from-db.provider';

// Set core configuration
export const setCoreConf = (async ({ conf }) => {
    await db.update(coreConfTable).set(conf);

    // ensure core conf cache is available
    await serverQueryClient.ensureQueryData({
        queryKey: coreConfQueryKey,

        queryFn: () => getCoreConfFromDb(),
    });

    await serverQueryClient.setQueryData(
        coreConfQueryKey,

        (cacheData) => {
            const parsingCache = coreConfWithErrorSchema.safeParse(cacheData);

            if (!parsingCache.success) {
                console.log(
                    `could not update corrupted core conf cache: ${JSON.stringify(
                        cacheData,
                    )}`,
                );

                return cacheData;
            }

            const { data: cache } = parsingCache;

            const { error } = cache;

            if (error !== null) {
                console.log(
                    `could not update core conf cache with error: ${cache.error}`,
                );

                return cacheData;
            }

            const { data } = cache;

            return Success(data);
        },
    );

    return Success();
}) satisfies Function<{ conf: CoreConf }>;
