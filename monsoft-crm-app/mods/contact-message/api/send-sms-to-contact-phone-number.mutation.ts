import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { sendSmsToContactPhoneNumberSchema } from '../schemas';
import { sendSmsToContactPhoneNumber as sendSmsToContactPhoneNumberProvider } from '../providers/server';

export const sendSmsToContactPhoneNumber = protectedEndpoint
    .input(sendSmsToContactPhoneNumberSchema)
    .mutation(
        queryMutationCallback(
            async ({ input: { contactPhoneNumberId, body } }) => {
                const { error } = await sendSmsToContactPhoneNumberProvider({
                    contactPhoneNumberId,
                    body,
                });

                if (error) return Error();

                return Success();
            },
        ),
    );
