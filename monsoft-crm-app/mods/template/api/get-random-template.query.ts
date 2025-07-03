import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { desc, sql } from 'drizzle-orm';

import { getCoreConf, getCustomConf } from '@conf/providers/server';

import { wait } from '@shared/utils/wait.util';
import { catchError } from '@errors/utils/catch-error.util';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

// query to get a random template
export const getRandomTemplate = protectedEndpoint.query(
    queryMutationCallback(
        async ({
            ctx: {
                session: {
                    user: { organizationId },
                },
            },
            db,
        }) => {
            // get the custom configuration for the organization
            const customConfWithError = await getCustomConf({ organizationId });

            const { error: customConfError } = customConfWithError;

            if (customConfError !== null) return Error('MISSING_CUSTOM_CONF');

            const { data: customConf } = customConfWithError;

            const { randomTemplateServiceActive } = customConf;

            // if the random-template service is not active, return null
            if (!randomTemplateServiceActive) return Error('SERVICE_INACTIVE');

            // get the core configuration
            const coreConfWithError = await getCoreConf();

            const { error: coreConfError } = coreConfWithError;

            if (coreConfError !== null) return Error('MISSING_CORE_CONF');

            const { data: coreConf } = coreConfWithError;

            const { randomTemplateDeterministic } = coreConf;

            // get a random template from the database
            const { data: randomTemplate, error } = await catchError(
                db.query.templateTable.findFirst({
                    orderBy: ({ id }) =>
                        randomTemplateDeterministic
                            ? // if random template-service is deterministic, sort by id
                              desc(id)
                            : // otherwise, sort randomly
                              sql`RAND()`,
                }),
            );

            if (error) return Error('QUERY_FAILED');

            if (randomTemplate === undefined) return Error('NOT_FOUND');

            // simulate a delay
            await wait(500);

            // return the random template
            return Success(randomTemplate);
        },
    ),
);
