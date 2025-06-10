import { Twilio } from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { appUrl } from '@dist/constants';

import { twilioStatusUpdateWebhookPath } from '@sms/constants';

export const sendSms = (async ({ client, from, to, body }) => {
    const { data: message, error: messageError } = await catchError(
        client.messages.create({
            body,
            from,
            to,
            statusCallback: `${appUrl}${twilioStatusUpdateWebhookPath}`,
        }),
    );

    if (messageError) return Error();

    const { sid } = message;

    const result = {
        sid,
    };

    return Success(result);
}) satisfies Function<
    { client: Twilio; from: string; to: string; body: string },
    { sid: string }
>;
