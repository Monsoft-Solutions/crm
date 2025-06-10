import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { CustomConf, customConfSchema } from '@conf/custom/schemas';

import { db } from '@db/providers/server';
import { catchError } from '@errors/utils/catch-error.util';

// Auxiliary function to get Custom configuration from db, without caching
export const getCustomConfFromDb = (async ({ organizationId }) => {
    const { data: customConfWithMetadata, error } = await catchError(
        db.query.customConfTable.findFirst({
            where: (record, { eq }) =>
                eq(record.organizationId, organizationId),
        }),
    );

    // if some error occurred while fetching the Custom configuration
    if (error) return Error();

    if (customConfWithMetadata === undefined) return Error('NO_CUSTOM_CONF');

    const parsingCustomConfWithoutMetadata = customConfSchema.safeParse(
        customConfWithMetadata,
    );

    if (!parsingCustomConfWithoutMetadata.success)
        return Error('PARSING_CUSTOM_CONF');

    const { data } = parsingCustomConfWithoutMetadata;

    return Success(data);
}) satisfies Function<{ organizationId: string }, CustomConf>;
