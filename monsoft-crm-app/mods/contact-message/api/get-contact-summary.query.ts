import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { getContactLastEvent } from '@mods/contact/providers/get-contact-last-event.provider';

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

            const numUnreadInboundMessages = smsMessages.filter(
                (smsMessage) =>
                    smsMessage.direction === 'inbound' &&
                    smsMessage.status !== 'read',
            ).length;

            const { data: lastEvent, error: lastEventError } =
                await getContactLastEvent({ db, contactId });

            if (lastEventError) return Error();

            const summary = {
                contact,
                numUnreadInboundMessages,
                lastEvent,
            };

            return Success(summary);
        }),
    );
