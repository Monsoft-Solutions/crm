import { Error, Success } from '@errors/utils';

import { publicEndpoint } from '@api/providers/server';

import { getTemplatesStats as getTemplatesStatsProvider } from '../providers/server';

import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const getTemplatesStats = publicEndpoint.query(
    queryMutationCallback(async ({ db }) => {
        // get the templates stats
        const { data: templateStatsData, error: templateStatsError } =
            await getTemplatesStatsProvider({ db });

        if (templateStatsError) return Error();

        // return the templates stats
        return Success(templateStatsData);
    }),
);
