import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { getTwilioClientMain } from '@twilio/providers';

import { getCoreConf } from '@conf/providers/server';

import { sendWhatsapp } from './send-whatsapp.provider';

export const sendAppWhatsapp = (async ({ to, body }) => {
    const { data: coreConf, error: coreConfError } = await getCoreConf();

    if (coreConfError) return Error();

    const { twilioFrom } = coreConf;

    const { data: client, error: clientError } = await getTwilioClientMain();

    if (clientError) return Error();

    const { data: message, error: messageError } = await sendWhatsapp({
        client,
        from: twilioFrom,
        to,
        body,
    });

    if (messageError) return Error();

    const { sid } = message;

    const result = {
        sid,
    };

    return Success(result);
}) satisfies Function<{ to: string; body: string }, { sid: string }>;
