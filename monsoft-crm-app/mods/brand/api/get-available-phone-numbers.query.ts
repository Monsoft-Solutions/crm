import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { getTwilioClientOrg } from '@sms/providers';

export const getAvailablePhoneNumbers = protectedEndpoint.query(
    queryMutationCallback(
        async ({
            ctx: {
                session: {
                    user: { organizationId },
                },
            },
        }) => {
            const { data: client, error: clientError } =
                await getTwilioClientOrg({
                    organizationId,
                });

            if (clientError) return Error();

            const availableTwilioNumbers = await client
                .availablePhoneNumbers('US')
                .local.list({
                    smsEnabled: true,
                    limit: 10,
                });

            const availablePhoneNumbers = availableTwilioNumbers.map(
                ({ phoneNumber }) => phoneNumber,
            );

            return Success(availablePhoneNumbers);
        },
    ),
);
