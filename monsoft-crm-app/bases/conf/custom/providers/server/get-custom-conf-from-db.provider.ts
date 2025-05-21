import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { CustomConf, customConfSchema } from '@conf/custom/schemas';

import { db } from '@db/providers/server';
import { catchError } from '@errors/utils/catch-error.util';

// Auxiliary function to get Custom configuration from db, without caching
export const getCustomConfFromDb = (async ({ organizationId }) => {
    const { data: currentAndNextConfs, error } = await catchError(
        db.query.customConfTable.findMany({
            where: (record, { and, eq, isNotNull }) =>
                and(
                    eq(record.organizationId, organizationId),
                    isNotNull(record.usage),
                ),
        }),
    );

    // if some error occurred while fetching the Custom configuration
    if (error) return Error();

    const currentConf = currentAndNextConfs.find(
        ({ usage }) => usage === 'current',
    );
    const nextConf = currentAndNextConfs.find(({ usage }) => usage === 'next');

    const activeConfWithMetadata = currentConf ?? nextConf;

    if (activeConfWithMetadata === undefined) return Error('NO_ACTIVE_CONF');

    const parsingActiveConfWithoutMetadata = customConfSchema.safeParse(
        activeConfWithMetadata,
    );

    if (!parsingActiveConfWithoutMetadata.success)
        return Error('PARSING_ACTIVE');

    const { data } = parsingActiveConfWithoutMetadata;

    return Success(data);
}) satisfies Function<{ organizationId: string }, CustomConf>;
