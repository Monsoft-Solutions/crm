import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { and, eq, ne } from 'drizzle-orm';
import { db } from '@db/providers/server';
import tables from '@db/db';

export const setDefaultContactPhoneNumber = protectedEndpoint
    .input(z.object({ phoneNumberId: z.string() }))
    .mutation(
        queryMutationCallback(async ({ input: { phoneNumberId } }) => {
            const { error } = await catchError(
                db.transaction(async (tx) => {
                    const contactPhoneNumber =
                        await tx.query.contactPhoneNumber.findFirst({
                            where: (record, { eq }) =>
                                eq(record.id, phoneNumberId),
                        });

                    if (!contactPhoneNumber)
                        throw 'CONTACT_PHONE_NUMBER_NOT_FOUND';

                    const { contactId } = contactPhoneNumber;

                    await tx
                        .update(tables.contactPhoneNumber)
                        .set({
                            isDefault: null,
                        })
                        .where(
                            and(
                                eq(
                                    tables.contactPhoneNumber.contactId,
                                    contactId,
                                ),
                                ne(tables.contactPhoneNumber.id, phoneNumberId),
                            ),
                        );

                    await tx
                        .update(tables.contactPhoneNumber)
                        .set({
                            isDefault: 'true',
                        })
                        .where(eq(tables.contactPhoneNumber.id, phoneNumberId));
                }),
            );

            if (error) return Error();

            return Success();
        }),
    );
