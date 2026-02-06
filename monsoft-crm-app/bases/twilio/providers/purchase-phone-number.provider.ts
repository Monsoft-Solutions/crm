import { Twilio } from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

export const purchasePhoneNumber = (async ({ client, phoneNumber }) => {
    const { data: purchased, error: purchaseError } = await catchError(
        client.incomingPhoneNumbers.create({ phoneNumber }),
    );

    if (purchaseError) return Error();

    const result = {
        sid: purchased.sid,
        phoneNumber: purchased.phoneNumber,
        friendlyName: purchased.friendlyName,
    };

    return Success(result);
}) satisfies Function<
    { client: Twilio; phoneNumber: string },
    { sid: string; phoneNumber: string; friendlyName: string }
>;
