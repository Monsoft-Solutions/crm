import { Success, Error } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import {
    getTwilioClientOrg,
    purchasePhoneNumber as purchasePhoneNumberProvider,
} from '@twilio/providers';

import { logger } from '@log/providers';

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
                logger.info('Purchase phone number requested', {
                    label: 'whatsapp',
                    phoneNumber,
                    organizationId,
                });

                const { data: client, error: clientError } =
                    await getTwilioClientOrg({
                        organizationId,
                    });

                if (clientError) {
                    logger.error('Failed to get Twilio client', {
                        label: 'whatsapp',
                        organizationId,
                    });
                    return Error('TWILIO_CLIENT_ERROR');
                }

                const { data: purchased, error: purchaseError } =
                    await purchasePhoneNumberProvider({
                        client,
                        phoneNumber,
                    });

                if (purchaseError) {
                    logger.error('Phone number purchase failed', {
                        label: 'whatsapp',
                        phoneNumber,
                        organizationId,
                    });
                    return Error('PURCHASE_FAILED');
                }

                logger.info('Phone number purchased successfully', {
                    label: 'whatsapp',
                    sid: purchased.sid,
                    phoneNumber: purchased.phoneNumber,
                    organizationId,
                });

                return Success(purchased);
            },
        ),
    );
