import { createTwilioSink } from './create-twilio-sink.provider';

import { getTwilioClientOrg } from './get-twilio-client-org.provider';

export const createTwilioOrgSink = async ({
    organizationId,
}: {
    organizationId: string;
}) => {
    const { data: twilioClient, error: twilioClientError } =
        await getTwilioClientOrg({
            organizationId,
        });

    if (twilioClientError) {
        console.error('Error getting twilio client', twilioClientError);
        return;
    }

    await createTwilioSink({
        twilioClient,
    });
};
