import { Twilio } from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';
import { logger } from '@log/providers';

export const registerWhatsappSender = (async ({ client, phoneNumberSid }) => {
    logger.info('Registering WhatsApp sender', {
        label: 'twilio',
        phoneNumberSid,
    });

    const { data: services, error: servicesError } = await catchError(
        client.messaging.v1.services.list({ limit: 1 }),
    );

    if (servicesError) {
        logger.error('Failed to list messaging services', {
            label: 'twilio',
            error: String(servicesError),
        });
        return Error();
    }

    logger.info('Found messaging services', {
        label: 'twilio',
        count: services.length,
    });

    const service = services.at(0);

    if (!service) {
        logger.error('No messaging service found', { label: 'twilio' });
        return Error('NO_MESSAGING_SERVICE');
    }

    const { data: sender, error: senderError } = await catchError(
        client.messaging.v1
            .services(service.sid)
            .phoneNumbers.create({ phoneNumberSid }),
    );

    if (senderError) {
        logger.error('Failed to register WhatsApp sender', {
            label: 'twilio',
            phoneNumberSid,
            serviceSid: service.sid,
            error: String(senderError),
        });
        return Error();
    }

    const result = {
        senderSid: sender.sid,
        status: 'creating' as const,
    };

    logger.info('WhatsApp sender registered', {
        label: 'twilio',
        senderSid: result.senderSid,
    });

    return Success(result);
}) satisfies Function<
    { client: Twilio; phoneNumberSid: string },
    { senderSid: string; status: 'creating' }
>;
