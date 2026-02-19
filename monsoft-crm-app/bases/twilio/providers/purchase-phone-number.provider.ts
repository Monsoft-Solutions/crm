import { Twilio } from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';
import { logger } from '@log/providers';

export const purchasePhoneNumber = (async ({ client, phoneNumber }) => {
    logger.info('Purchasing phone number', { label: 'twilio', phoneNumber });

    const { data: purchased, error: purchaseError } = await catchError(
        client.incomingPhoneNumbers.create({ phoneNumber }),
    );

    if (purchaseError) {
        logger.error('Failed to purchase phone number', {
            label: 'twilio',
            phoneNumber,
            error: String(purchaseError),
        });
        return Error();
    }

    const result = {
        sid: purchased.sid,
        phoneNumber: purchased.phoneNumber,
        friendlyName: purchased.friendlyName,
    };

    logger.info('Phone number purchased', {
        label: 'twilio',
        sid: result.sid,
        phoneNumber: result.phoneNumber,
    });

    return Success(result);
}) satisfies Function<
    { client: Twilio; phoneNumber: string },
    { sid: string; phoneNumber: string; friendlyName: string }
>;
