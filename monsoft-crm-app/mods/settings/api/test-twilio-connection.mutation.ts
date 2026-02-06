import twilio from 'twilio';

import { Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { testTwilioConnectionSchema } from '../schemas';

export const testTwilioConnection = protectedEndpoint
    .input(testTwilioConnectionSchema)
    .mutation(
        queryMutationCallback(async ({ input: { twilioSid, twilioToken } }) => {
            const client = twilio(twilioSid, twilioToken);

            const { data: account, error } = await catchError(
                client.api.accounts(twilioSid).fetch(),
            );

            if (error) return Success({ valid: false, accountName: '' });

            return Success({
                valid: true,
                accountName: account.friendlyName,
            });
        }),
    );
