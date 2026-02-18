import { Twilio } from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { logger } from '@log/providers';

export const sendWhatsapp = (async ({
    client,
    from,
    to,
    body,
    statusCallback,
}) => {
    logger.info('[sendWhatsapp] Sending message', { from, to });

    const { data: message, error: messageError } = await catchError(
        client.messages.create({
            body,
            from: `whatsapp:${from}`,
            to: `whatsapp:${to}`,
            ...(statusCallback ? { statusCallback } : {}),
        }),
    );

    if (messageError) {
        logger.error('[sendWhatsapp] Failed to send message', {
            from,
            to,
            error: String(messageError),
        });
        return Error('WHATSAPP_SEND_FAILED');
    }

    const { sid } = message;

    logger.info('[sendWhatsapp] Message sent successfully', { sid });

    const result = {
        sid,
    };

    return Success(result);
}) satisfies Function<
    {
        client: Twilio;
        from: string;
        to: string;
        body: string;
        statusCallback?: string;
    },
    { sid: string }
>;
