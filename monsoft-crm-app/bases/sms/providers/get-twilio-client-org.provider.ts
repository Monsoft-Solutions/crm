import twilio, { Twilio } from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { getCustomConf } from '@conf/providers/server';

export const getTwilioClientOrg = (async ({ organizationId }) => {
    const { data: customConf, error: customConfError } = await getCustomConf({
        organizationId,
    });

    if (customConfError) return Error();

    const { twilioSid, twilioToken } = customConf;

    if (!twilioSid || !twilioToken) return Error('TWILIO_CUSTOM_CONF_NOT_SET');

    const client = twilio(twilioSid, twilioToken);

    return Success(client);
}) satisfies Function<{ organizationId: string }, Twilio>;
