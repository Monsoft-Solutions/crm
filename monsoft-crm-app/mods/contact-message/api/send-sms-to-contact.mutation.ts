import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { sendSmsToContactSchema } from '../schemas';
import { sendSmsToContact as sendSmsToContactProvider } from '../providers/server';

export const sendSmsToContact = protectedEndpoint
    .input(sendSmsToContactSchema)
    .mutation(
        queryMutationCallback(
            async ({ input: { contactPhoneNumberId, body } }) => {
                const { error } = await sendSmsToContactProvider({
                    contactPhoneNumberId,
                    body,
                });

                if (error) return Error();

                return Success();
            },
        ),
    );
