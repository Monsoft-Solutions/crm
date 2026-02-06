import { Twilio } from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

export const getWhatsappSenders = (async ({ client }) => {
    const { data: services, error: servicesError } = await catchError(
        client.messaging.v1.services.list({ limit: 1 }),
    );

    if (servicesError) return Error();

    const service = services.at(0);

    if (!service) return Success([]);

    const { data: phoneNumbers, error: phoneNumbersError } = await catchError(
        client.messaging.v1.services(service.sid).phoneNumbers.list(),
    );

    if (phoneNumbersError) return Error();

    const result = phoneNumbers.map((p) => ({
        senderSid: p.sid,
        phoneNumber: p.phoneNumber,
    }));

    return Success(result);
}) satisfies Function<
    { client: Twilio },
    { senderSid: string; phoneNumber: string }[]
>;
