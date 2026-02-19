import { z } from 'zod';

import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { getContactEmailMessages } from '../providers/server';

export const getContactEmails = protectedEndpoint
    .input(z.object({ contactId: z.string() }))
    .query(
        queryMutationCallback(async ({ input: { contactId }, db }) => {
            const { data: emails, error: emailsError } =
                await getContactEmailMessages({
                    contactId,
                    db,
                });

            if (emailsError) return Error();

            return Success(emails);
        }),
    );
