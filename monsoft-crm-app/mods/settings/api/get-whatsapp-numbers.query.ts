import { eq } from 'drizzle-orm';

import { Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import tables from '@db/db';

export const getWhatsappNumbers = protectedEndpoint.query(
    queryMutationCallback(
        async ({
            ctx: {
                session: {
                    user: { organizationId },
                },
            },
            db,
        }) => {
            const { data: whatsappNumbers, error: queryError } =
                await catchError(
                    db
                        .select({
                            id: tables.brandWhatsappNumber.id,
                            phoneNumber: tables.brandWhatsappNumber.phoneNumber,
                            twilioSid: tables.brandWhatsappNumber.twilioSid,
                            senderStatus:
                                tables.brandWhatsappNumber.senderStatus,
                            isDefault: tables.brandWhatsappNumber.isDefault,
                            brandId: tables.brand.id,
                            brandName: tables.brand.name,
                        })
                        .from(tables.brandWhatsappNumber)
                        .innerJoin(
                            tables.brand,
                            eq(
                                tables.brandWhatsappNumber.brandId,
                                tables.brand.id,
                            ),
                        )
                        .where(eq(tables.brand.organizationId, organizationId)),
                );

            if (queryError) return Success([]);

            return Success(whatsappNumbers);
        },
    ),
);
