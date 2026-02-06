import { Success, Error } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { getTwilioClientOrg, searchAvailableNumbers } from '@twilio/providers';

import { searchAvailableNumbersSchema } from '../schemas';

export const searchAvailablePhoneNumbers = protectedEndpoint
    .input(searchAvailableNumbersSchema)
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: {
                        user: { organizationId },
                    },
                },
                input: { countryCode, areaCode },
            }) => {
                const { data: client, error: clientError } =
                    await getTwilioClientOrg({
                        organizationId,
                    });

                if (clientError) return Error('TWILIO_CLIENT_ERROR');

                const { data: numbers, error: numbersError } =
                    await searchAvailableNumbers({
                        client,
                        countryCode,
                        areaCode,
                    });

                if (numbersError) return Error('SEARCH_FAILED');

                return Success(numbers);
            },
        ),
    );
