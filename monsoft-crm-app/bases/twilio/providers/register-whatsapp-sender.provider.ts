import { Twilio } from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

export const registerWhatsappSender = (async ({ client, phoneNumber }) => {
    const { data: services, error: servicesError } = await catchError(
        client.messaging.v1.services.list({ limit: 1 }),
    );

    if (servicesError) return Error();

    const service = services.at(0);

    if (!service) return Error('NO_MESSAGING_SERVICE');

    const { data: sender, error: senderError } = await catchError(
        client.messaging.v1
            .services(service.sid)
            .phoneNumbers.create({ phoneNumberSid: phoneNumber }),
    );

    if (senderError) return Error();

    const result = {
        senderSid: sender.sid,
        status: 'creating' as const,
    };

    return Success(result);
}) satisfies Function<
    { client: Twilio; phoneNumber: string },
    { senderSid: string; status: 'creating' }
>;
