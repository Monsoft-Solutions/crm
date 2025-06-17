import twilio, { Twilio } from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { getCoreConf } from '@conf/providers/server';

export const getTwilioClientMain = (async () => {
    const { data: coreConf, error: coreConfError } = await getCoreConf();

    if (coreConfError) return Error();

    const { twilioSid, twilioToken } = coreConf;

    const client = twilio(twilioSid, twilioToken);

    return Success(client);
}) satisfies Function<void, Twilio>;
