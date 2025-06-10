import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { CoreConf, coreConfSchema } from '@conf/core/schemas';

import { db } from '@db/providers/server';
import { catchError } from '@errors/utils/catch-error.util';

// Auxiliary function to get core configuration from db, without caching
export const getCoreConfFromDb = (async () => {
    const { data: coreConfWithMetadata, error } = await catchError(
        db.query.coreConfTable.findFirst(),
    );

    // if some error occurred while fetching the core configuration
    if (error) return Error();

    if (coreConfWithMetadata === undefined) return Error('NO_CORE_CONF');

    const parsingCoreConfWithoutMetadata =
        coreConfSchema.safeParse(coreConfWithMetadata);

    if (!parsingCoreConfWithoutMetadata.success)
        return Error('PARSING_CORE_CONF');

    const { data } = parsingCoreConfWithoutMetadata;

    return Success(data);
}) satisfies Function<void, CoreConf>;
