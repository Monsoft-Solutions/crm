import { and, eq, ne } from 'drizzle-orm';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import tables from '@db/db';

import { setDefaultBrandPhoneNumberSchema } from '../schemas';

export const setDefaultBrandPhoneNumber = protectedEndpoint
    .input(setDefaultBrandPhoneNumberSchema)
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: {
                        user: { organizationId },
                    },
                },
                input: { phoneNumber },
                db,
            }) => {
                // Find the brandPhoneNumber row for this phoneNumber (scoped to org)
                const { data: brandPhoneNumbers, error: findError } =
                    await catchError(
                        db
                            .select({
                                id: tables.brandPhoneNumber.id,
                                brandId: tables.brandPhoneNumber.brandId,
                            })
                            .from(tables.brandPhoneNumber)
                            .innerJoin(
                                tables.brand,
                                eq(
                                    tables.brandPhoneNumber.brandId,
                                    tables.brand.id,
                                ),
                            )
                            .where(
                                and(
                                    eq(
                                        tables.brandPhoneNumber.phoneNumber,
                                        phoneNumber,
                                    ),
                                    eq(
                                        tables.brand.organizationId,
                                        organizationId,
                                    ),
                                ),
                            ),
                    );

                if (findError) return Error();

                const brandPhoneNumber = brandPhoneNumbers.at(0);

                if (!brandPhoneNumber) return Error();

                const { id, brandId } = brandPhoneNumber;

                // Clear isDefault on all other numbers for this brand
                const { error: clearError } = await catchError(
                    db
                        .update(tables.brandPhoneNumber)
                        .set({ isDefault: null })
                        .where(
                            and(
                                eq(tables.brandPhoneNumber.brandId, brandId),
                                ne(tables.brandPhoneNumber.id, id),
                            ),
                        ),
                );

                if (clearError) return Error();

                // Set isDefault on the target row
                const { error: setError } = await catchError(
                    db
                        .update(tables.brandPhoneNumber)
                        .set({ isDefault: 'true' })
                        .where(eq(tables.brandPhoneNumber.id, id)),
                );

                if (setError) return Error();

                return Success();
            },
        ),
    );
