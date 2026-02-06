import { Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { setCustomConf } from '@conf/providers/server';

import { updateTwilioCredentialsSchema } from '../schemas';

export const updateTwilioCredentials = protectedEndpoint
    .input(updateTwilioCredentialsSchema)
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: {
                        user: { organizationId },
                    },
                },
                input: { twilioSid, twilioToken },
            }) => {
                await setCustomConf({
                    organizationId,
                    conf: { twilioSid, twilioToken },
                });

                return Success();
            },
        ),
    );
