import { Success, Error } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import {
    getTwilioClientOrg,
    purchasePhoneNumber as purchasePhoneNumberProvider,
} from '@twilio/providers';

import { purchasePhoneNumberSchema } from '../schemas';

export const purchasePhoneNumber = protectedEndpoint
    .input(purchasePhoneNumberSchema)
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: {
                        user: { organizationId },
                    },
                },
                input: { phoneNumber },
            }) => {
                const { data: client, error: clientError } =
                    await getTwilioClientOrg({
                        organizationId,
                    });

                if (clientError) return Error('TWILIO_CLIENT_ERROR');

                const { data: purchased, error: purchaseError } =
                    await purchasePhoneNumberProvider({
                        client,
                        phoneNumber,
                    });

                if (purchaseError) return Error('PURCHASE_FAILED');

                return Success(purchased);
            },
        ),
    );
