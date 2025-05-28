import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { sendEmailToContactSchema } from '../schemas';
import { sendEmailToContact as sendEmailToContactProvider } from '../providers/server';

export const sendEmailToContact = protectedEndpoint
    .input(sendEmailToContactSchema)
    .mutation(
        queryMutationCallback(
            async ({ input: { contactEmailAddressId, body } }) => {
                const { error } = await sendEmailToContactProvider({
                    contactEmailAddressId,
                    body,
                });

                if (error) return Error();

                return Success();
            },
        ),
    );
