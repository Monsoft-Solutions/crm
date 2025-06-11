import { Twilio } from 'twilio';

import { appUrl } from '@dist/constants';
import { twilioEventWebhookPath } from '@sms/constants';

import { TwilioSinkConf } from '../types';
import { twilioEventTypeEnum } from '@sms/enums';

const twilioEventsUrl = `${appUrl}${twilioEventWebhookPath}`;

export const createTwilioSink = async ({
    twilioClient,
}: {
    twilioClient: Twilio;
}) => {
    const sinks = await twilioClient.events.v1.sinks.list();

    const existingSink = sinks.find(
        ({ sinkConfiguration }) =>
            (sinkConfiguration as TwilioSinkConf).destination ===
            twilioEventsUrl,
    );

    if (existingSink) return;

    const sink = await twilioClient.events.v1.sinks.create({
        sinkType: 'webhook',

        description: 'Twilio SMS Sink - ' + new Date().toISOString(),

        sinkConfiguration: {
            method: 'post',
            destination: twilioEventsUrl,
            batch_events: false,
        },
    });

    await twilioClient.events.v1.subscriptions.create({
        sinkSid: sink.sid,
        description: 'SMS events',
        types: twilioEventTypeEnum.options,
    });
};
