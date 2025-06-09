import { Function } from '@errors/types';
import { Success } from '@errors/utils';

import { eq } from 'drizzle-orm';

import { serverQueryClient } from '@api/providers/server';

import { db } from '@db/providers/server';

import { CustomConf, customConfWithErrorSchema } from '@conf/custom/schemas';

import { customConfTable } from '@conf/db';

import { getCustomConfQueryKey } from '@conf/custom/utils';

import { getCustomConfFromDb } from './get-custom-conf-from-db.provider';

// Set Custom configuration
export const setCustomConf = (async ({ organizationId, conf }) => {
    await db
        .update(customConfTable)
        .set(conf)
        .where(eq(customConfTable.usage, 'current'));

    // ensure custom conf cache is available
    await serverQueryClient.ensureQueryData({
        queryKey: getCustomConfQueryKey({ organizationId }),

        queryFn: () => getCustomConfFromDb({ organizationId }),
    });

    await serverQueryClient.setQueryData(
        getCustomConfQueryKey({ organizationId }),

        (cacheData) => {
            const parsingCache = customConfWithErrorSchema.safeParse(cacheData);

            if (!parsingCache.success) {
                console.log(
                    `could not update corrupted custom conf cache: ${JSON.stringify(
                        cacheData,
                    )}`,
                );

                return cacheData;
            }

            const { data: cache } = parsingCache;

            const { error } = cache;

            if (error !== null) {
                console.log(
                    `could not update custom conf cache with error: ${cache.error}`,
                );

                return cacheData;
            }

            const { data } = cache;

            return Success(data);
        },
    );

    return Success();
}) satisfies Function<{ organizationId: string; conf: Partial<CustomConf> }>;
