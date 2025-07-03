import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const getContactSummary = protectedEndpoint
    .input(z.object({ contactId: z.string() }))
    .query(
        queryMutationCallback(async ({ input: { contactId }, db }) => {
            const { error, data: rawContact } = await catchError(
                db.query.contact.findFirst({
                    where: (record, { eq }) => eq(record.id, contactId),

                    with: {
                        smsMessages: true,
                    },
                }),
            );

            if (error) return Error();
            if (!rawContact) return Error();

            const { id, firstName, lastName, smsMessages } = rawContact;

            const contact = {
                id,
                firstName,
                lastName,
            };

            const numUnreadMessages = smsMessages.filter(
                (smsMessage) => smsMessage.status !== 'read',
            ).length;

            const lastSmsMessage = smsMessages.at(-1);

            const lastMessage = lastSmsMessage
                ? {
                      direction: lastSmsMessage.direction,
                      body: lastSmsMessage.body,
                  }
                : null;

            const lastActivityTimestamp = lastSmsMessage
                ? lastSmsMessage.createdAt
                : rawContact.createdAt;

            const summary = {
                contact,
                lastMessage,
                numUnreadMessages,
                lastActivityTimestamp,
            };

            return Success(summary);
        }),
    );
