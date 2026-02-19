import { Twilio } from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

export const searchAvailableNumbers = (async ({
    client,
    countryCode,
    areaCode,
    limit,
}) => {
    const { data: numbers, error: numbersError } = await catchError(
        client.availablePhoneNumbers(countryCode).local.list({
            areaCode: areaCode ? Number(areaCode) : undefined,
            limit: limit ?? 20,
        }),
    );

    if (numbersError) return Error();

    const result = numbers.map((n) => ({
        phoneNumber: n.phoneNumber,
        friendlyName: n.friendlyName,
        capabilities: n.capabilities,
    }));

    return Success(result);
}) satisfies Function<
    {
        client: Twilio;
        countryCode: string;
        areaCode?: string;
        limit?: number;
    },
    {
        phoneNumber: string;
        friendlyName: string;
        capabilities: Record<string, boolean>;
    }[]
>;
