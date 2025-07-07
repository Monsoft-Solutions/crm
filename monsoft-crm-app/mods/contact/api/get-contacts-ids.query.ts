import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { getContactLastEvent } from '@mods/contact/providers/get-contact-last-event.provider';

export const getContactsIds = protectedEndpoint
    .input(
        z.object({
            brandId: z.string(),
        }),
    )
    .query(
        queryMutationCallback(async ({ input: { brandId }, db }) => {
            const { error, data: contacts } = await catchError(
                db.query.contact.findMany({
                    columns: {
                        id: true,
                    },
                    where: (record, { eq }) => eq(record.brandId, brandId),
                }),
            );

            if (error) return Error();

            const contactsWithLastEventTimes = await Promise.all(
                contacts.map(async (contact) => {
                    const { data: lastEvent, error: lastEventError } =
                        await getContactLastEvent({
                            contactId: contact.id,
                            db,
                        });

                    if (!lastEventError)
                        return {
                            id: contact.id,
                            timestamp: lastEvent.timestamp,
                        };
                }),
            );

            if (
                contactsWithLastEventTimes.some(
                    (contact) => contact === undefined,
                )
            )
                return Error();

            const contactsSorted = contactsWithLastEventTimes
                .filter((contact) => contact !== undefined)
                .sort((a, b) => b.timestamp - a.timestamp)
                .map(({ id }) => ({ id }));

            return Success(contactsSorted);
        }),
    );
