import { v4 as uuidv4 } from 'uuid';
import { and, eq } from 'drizzle-orm';

import { Success, Error } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import tables from '@db/db';

import { assignPhoneNumberBrandSchema } from '../schemas';

export const assignPhoneNumberBrand = protectedEndpoint
    .input(assignPhoneNumberBrandSchema)
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: {
                        user: { organizationId },
                    },
                },
                input: { phoneNumber, brandId },
                db,
            }) => {
                // Find existing assignment for this phone number (scoped to org)
                const { data: existing, error: findError } = await catchError(
                    db
                        .select({ id: tables.brandPhoneNumber.id })
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
                                eq(tables.brand.organizationId, organizationId),
                            ),
                        ),
                );

                if (findError) return Error('FIND_FAILED');

                // Delete existing assignment if any
                if (existing.length > 0) {
                    const { error: deleteError } = await catchError(
                        db
                            .delete(tables.brandPhoneNumber)
                            .where(
                                eq(tables.brandPhoneNumber.id, existing[0].id),
                            ),
                    );

                    if (deleteError) return Error('DELETE_FAILED');
                }

                // If brandId is null, we only needed to unassign
                if (!brandId) return Success();

                // Verify brand belongs to the user's organization
                const { data: brand, error: brandError } = await catchError(
                    db.query.brand.findFirst({
                        where: (record, { eq: e, and: a }) =>
                            a(
                                e(record.id, brandId),
                                e(record.organizationId, organizationId),
                            ),
                    }),
                );

                if (brandError || !brand) return Error('BRAND_NOT_FOUND');

                // Check if brand already has phone numbers to determine default
                const { data: existingNumbers, error: countError } =
                    await catchError(
                        db
                            .select({ id: tables.brandPhoneNumber.id })
                            .from(tables.brandPhoneNumber)
                            .where(
                                eq(tables.brandPhoneNumber.brandId, brandId),
                            ),
                    );

                if (countError) return Error('COUNT_FAILED');

                const isDefault =
                    existingNumbers.length === 0 ? ('true' as const) : null;

                // Insert new assignment
                const { error: insertError } = await catchError(
                    db.insert(tables.brandPhoneNumber).values({
                        id: uuidv4(),
                        brandId,
                        phoneNumber,
                        isDefault,
                    }),
                );

                if (insertError) return Error('INSERT_FAILED');

                return Success();
            },
        ),
    );
