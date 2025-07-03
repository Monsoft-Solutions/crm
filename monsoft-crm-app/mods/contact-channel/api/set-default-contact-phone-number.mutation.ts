import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { and, eq, ne } from 'drizzle-orm';
import tables from '@db/db';

export const setDefaultContactPhoneNumber = protectedEndpoint
    .input(z.object({ phoneNumberId: z.string() }))
    .mutation(
        queryMutationCallback(async ({ input: { phoneNumberId }, db }) => {
            const { data: contactPhoneNumber, error: contactPhoneNumberError } =
                await catchError(
                    db.query.contactPhoneNumber.findFirst({
                        where: (record, { eq }) => eq(record.id, phoneNumberId),
                    }),
                );

            if (contactPhoneNumberError) return Error();

            if (!contactPhoneNumber) return Error();

            const { contactId } = contactPhoneNumber;

            const { error: updateNonDefaultContactPhoneNumbersError } =
                await catchError(
                    db
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
                        ),
                );

            if (updateNonDefaultContactPhoneNumbersError) return Error();

            const { error: updateDefaultContactPhoneNumberError } =
                await catchError(
                    db
                        .update(tables.contactPhoneNumber)
                        .set({
                            isDefault: 'true',
                        })
                        .where(eq(tables.contactPhoneNumber.id, phoneNumberId)),
                );

            if (updateDefaultContactPhoneNumberError) return Error();

            return Success();
        }),
    );
