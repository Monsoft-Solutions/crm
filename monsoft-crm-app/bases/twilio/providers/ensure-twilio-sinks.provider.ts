import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { createTwilioMainSink } from './create-twilio-main-sink.provider';
import { createTwilioOrgSink } from './create-twilio-org-sink.provider';

export const ensureTwilioSinks = async () => {
    await createTwilioMainSink();

    const { data: organizations, error: organizationsError } = await catchError(
        db.query.organization.findMany(),
    );

    if (organizationsError) return;

    for (const organization of organizations) {
        const { id: organizationId } = organization;

        await createTwilioOrgSink({
            organizationId,
        });
    }
};
