import { and, eq, ne } from 'drizzle-orm';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import tables from '@db/db';

import { setDefaultBrandWhatsappNumberSchema } from '../schemas';

export const setDefaultBrandWhatsappNumber = protectedEndpoint
    .input(setDefaultBrandWhatsappNumberSchema)
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
                // Find the brandWhatsappNumber row for this phoneNumber (scoped to org)
                const { data: brandWhatsappNumbers, error: findError } =
                    await catchError(
                        db
                            .select({
                                id: tables.brandWhatsappNumber.id,
                                brandId: tables.brandWhatsappNumber.brandId,
                            })
                            .from(tables.brandWhatsappNumber)
                            .innerJoin(
                                tables.brand,
                                eq(
                                    tables.brandWhatsappNumber.brandId,
                                    tables.brand.id,
                                ),
                            )
                            .where(
                                and(
                                    eq(
                                        tables.brandWhatsappNumber.phoneNumber,
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

                const brandWhatsappNumber = brandWhatsappNumbers.at(0);

                if (!brandWhatsappNumber) return Error();

                const { id, brandId } = brandWhatsappNumber;

                // Clear isDefault on all other numbers for this brand
                const { error: clearError } = await catchError(
                    db
                        .update(tables.brandWhatsappNumber)
                        .set({ isDefault: null })
                        .where(
                            and(
                                eq(tables.brandWhatsappNumber.brandId, brandId),
                                ne(tables.brandWhatsappNumber.id, id),
                            ),
                        ),
                );

                if (clearError) return Error();

                // Set isDefault on the target row
                const { error: setError } = await catchError(
                    db
                        .update(tables.brandWhatsappNumber)
                        .set({ isDefault: 'true' })
                        .where(eq(tables.brandWhatsappNumber.id, id)),
                );

                if (setError) return Error();

                return Success();
            },
        ),
    );
