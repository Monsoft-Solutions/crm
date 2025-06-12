import { createTwilioSink } from './create-twilio-sink.provider';

import { getTwilioClientMain } from './get-twilio-client-main.provider';

export const createTwilioMainSink = async () => {
    const { data: twilioClient, error: twilioClientError } =
        await getTwilioClientMain();

    if (twilioClientError) {
        console.error('Error getting twilio client', twilioClientError);
        return;
    }

    await createTwilioSink({
        twilioClient,
    });
};
