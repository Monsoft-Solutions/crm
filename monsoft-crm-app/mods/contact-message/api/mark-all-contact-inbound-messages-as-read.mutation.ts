import { z } from 'zod';

import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { markAllContactInboundMessagesAsRead as markAllContactInboundMessagesAsReadProvider } from '../providers/server/mark-all-contact-inbound-messages-as-read.provider';

export const markAllContactInboundMessagesAsRead = protectedEndpoint
    .input(z.object({ contactId: z.string() }))
    .mutation(
        queryMutationCallback(async ({ input: { contactId }, db }) => {
            const { error } = await markAllContactInboundMessagesAsReadProvider(
                {
                    contactId,
                    db,
                },
            );

            if (error) return Error();

            return Success();
        }),
    );
