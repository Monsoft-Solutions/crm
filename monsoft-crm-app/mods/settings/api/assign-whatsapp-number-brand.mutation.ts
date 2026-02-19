import { v4 as uuidv4 } from 'uuid';
import { and, eq, inArray } from 'drizzle-orm';

import { Success, Error } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import tables from '@db/db';
import { logger } from '@log/providers';

import { assignWhatsappNumberBrandSchema } from '../schemas';

export const assignWhatsappNumberBrand = protectedEndpoint
    .input(assignWhatsappNumberBrandSchema)
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
                logger.info('Assign WhatsApp number to brand requested', {
                    label: 'whatsapp',
                    phoneNumber,
                    brandId,
                    organizationId,
                });

                // Find existing assignment for this WhatsApp number (scoped to org)
                const { data: existing, error: findError } = await catchError(
                    db
                        .select({
                            id: tables.brandWhatsappNumber.id,
                            senderStatus:
                                tables.brandWhatsappNumber.senderStatus,
                            twilioSid: tables.brandWhatsappNumber.twilioSid,
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
                                eq(tables.brand.organizationId, organizationId),
                            ),
                        ),
                );

                if (findError) {
                    logger.error('Failed to find existing assignment', {
                        label: 'whatsapp',
                        phoneNumber,
                        organizationId,
                    });
                    return Error('FIND_FAILED');
                }

                // Delete existing assignment if any
                if (existing.length > 0) {
                    const existingIds = existing.map((row) => row.id);

                    logger.info('Removing existing brand assignments', {
                        label: 'whatsapp',
                        existingIds,
                    });

                    const { error: deleteError } = await catchError(
                        db
                            .delete(tables.brandWhatsappNumber)
                            .where(
                                inArray(
                                    tables.brandWhatsappNumber.id,
                                    existingIds,
                                ),
                            ),
                    );

                    if (deleteError) {
                        logger.error('Failed to delete existing assignments', {
                            label: 'whatsapp',
                            existingIds,
                        });
                        return Error('DELETE_FAILED');
                    }
                }

                // If brandId is null, we only needed to unassign
                if (!brandId) {
                    logger.info('WhatsApp number unassigned from brand', {
                        label: 'whatsapp',
                        phoneNumber,
                    });
                    return Success();
                }

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

                if (brandError || !brand) {
                    logger.error('Brand not found or access denied', {
                        label: 'whatsapp',
                        brandId,
                        organizationId,
                    });
                    return Error('BRAND_NOT_FOUND');
                }

                // Check if brand already has WhatsApp numbers to determine default
                const { data: existingNumbers, error: countError } =
                    await catchError(
                        db
                            .select({ id: tables.brandWhatsappNumber.id })
                            .from(tables.brandWhatsappNumber)
                            .where(
                                eq(tables.brandWhatsappNumber.brandId, brandId),
                            ),
                    );

                if (countError) {
                    logger.error('Failed to count existing numbers', {
                        label: 'whatsapp',
                        brandId,
                    });
                    return Error('COUNT_FAILED');
                }

                const isDefault =
                    existingNumbers.length === 0 ? ('true' as const) : null;

                // Preserve sender state from existing assignment if available
                const previousRecord = existing.length > 0 ? existing[0] : null;

                // Insert new assignment
                const { error: insertError } = await catchError(
                    db.insert(tables.brandWhatsappNumber).values({
                        id: uuidv4(),
                        brandId,
                        phoneNumber,
                        isDefault,
                        senderStatus: previousRecord?.senderStatus ?? 'offline',
                        twilioSid: previousRecord?.twilioSid ?? null,
                    }),
                );

                if (insertError) {
                    logger.error('Failed to insert brand assignment', {
                        label: 'whatsapp',
                        phoneNumber,
                        brandId,
                    });
                    return Error('INSERT_FAILED');
                }

                logger.info('WhatsApp number assigned to brand', {
                    label: 'whatsapp',
                    phoneNumber,
                    brandId,
                    isDefault,
                });

                return Success();
            },
        ),
    );
