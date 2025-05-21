import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { CoreConf, coreConfSchema } from '@conf/core/schemas';

import { db } from '@db/providers/server';
import { catchError } from '@errors/utils/catch-error.util';

// Auxiliary function to get core configuration from db, without caching
export const getCoreConfFromDb = (async () => {
    const { data: currentAndNextConfs, error } = await catchError(
        db.query.coreConfTable.findMany({
            where: ({ usage }, { isNotNull }) => isNotNull(usage),
        }),
    );

    // if some error occurred while fetching the core configuration
    if (error) return Error();

    const currentConf = currentAndNextConfs.find(
        ({ usage }) => usage === 'current',
    );
    const nextConf = currentAndNextConfs.find(({ usage }) => usage === 'next');

    const activeConfWithMetadata = currentConf ?? nextConf;

    if (activeConfWithMetadata === undefined) return Error('NO_ACTIVE_CONF');

    const parsingActiveConfWithoutMetadata = coreConfSchema.safeParse(
        activeConfWithMetadata,
    );

    if (!parsingActiveConfWithoutMetadata.success)
        return Error('PARSING_ACTIVE');

    const { data } = parsingActiveConfWithoutMetadata;

    return Success(data);
}) satisfies Function<void, CoreConf>;
