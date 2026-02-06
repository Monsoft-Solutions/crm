import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { getCustomConf } from '@conf/providers/server';

export const getTwilioCredentials = protectedEndpoint.query(
    queryMutationCallback(
        async ({
            ctx: {
                session: {
                    user: { organizationId },
                },
            },
        }) => {
            const { data: conf, error: confError } = await getCustomConf({
                organizationId,
            });

            if (confError) return Error('CUSTOM_CONF_ERROR');

            return Success({
                twilioSid: conf.twilioSid ?? '',
                twilioToken: conf.twilioToken ?? '',
            });
        },
    ),
);
