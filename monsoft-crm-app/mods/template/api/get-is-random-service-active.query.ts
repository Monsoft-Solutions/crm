import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { getCustomConf } from '@conf/providers/server';

// query to check whether the random-template service is active
export const getIsRandomServiceActive = protectedEndpoint.query(
    queryMutationCallback(
        async ({
            ctx: {
                session: {
                    user: { organizationId },
                },
            },
        }) => {
            // get the custom configuration for the organization
            const customConfWithError = await getCustomConf({ organizationId });

            const { error: customConfError } = customConfWithError;

            if (customConfError !== null) return Error();

            const { data: customConf } = customConfWithError;

            const { randomTemplateServiceActive } = customConf;

            // return whether the random-template service is active
            return Success(randomTemplateServiceActive);
        },
    ),
);
