import twilio from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { getCoreConf } from '@conf/providers/server';

import { appUrl } from '@dist/constants';

import { twilioStatusUpdateWebhookPath } from '@sms/constants';

export const sendSms = (async ({ to, body }) => {
    const { data: coreConf, error: coreConfError } = await getCoreConf();

    if (coreConfError) return Error();

    const { twilioSid, twilioToken, twilioFrom } = coreConf;

    const client = twilio(twilioSid, twilioToken);

    const { data: message, error: messageError } = await catchError(
        client.messages.create({
            body,
            from: twilioFrom,
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
}) satisfies Function<{ to: string; body: string }, { sid: string }>;
