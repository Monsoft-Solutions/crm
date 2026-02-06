import { eq } from 'drizzle-orm';

import { Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { getTwilioClientOrg } from '@twilio/providers';

import tables from '@db/db';

export const getOwnedPhoneNumbers = protectedEndpoint.query(
    queryMutationCallback(
        async ({
            ctx: {
                session: {
                    user: { organizationId },
                },
            },
            db,
        }) => {
            const { data: client, error: clientError } =
                await getTwilioClientOrg({
                    organizationId,
                });

            if (clientError) return Success([]);

            const { data: incomingNumbers, error: listError } =
                await catchError(client.incomingPhoneNumbers.list());

            if (listError) return Success([]);

            const { data: brandPhoneNumbers, error: brandPhoneError } =
                await catchError(
                    db
                        .select({
                            phoneNumber: tables.brandPhoneNumber.phoneNumber,
                            brandName: tables.brand.name,
                            brandId: tables.brand.id,
                            isDefault: tables.brandPhoneNumber.isDefault,
                        })
                        .from(tables.brandPhoneNumber)
                        .innerJoin(
                            tables.brand,
                            eq(
                                tables.brandPhoneNumber.brandId,
                                tables.brand.id,
                            ),
                        )
                        .where(eq(tables.brand.organizationId, organizationId)),
                );

            if (brandPhoneError) return Success([]);

            const brandMap = new Map(
                brandPhoneNumbers.map((bp) => [
                    bp.phoneNumber,
                    {
                        brandName: bp.brandName,
                        brandId: bp.brandId,
                        isDefault: bp.isDefault,
                    },
                ]),
            );

            const result = incomingNumbers.map((number) => {
                const brand = brandMap.get(number.phoneNumber);

                return {
                    phoneNumber: number.phoneNumber,
                    friendlyName: number.friendlyName,
                    sid: number.sid,
                    brandName: brand?.brandName ?? null,
                    brandId: brand?.brandId ?? null,
                    isDefault: brand?.isDefault ?? null,
                };
            });

            return Success(result);
        },
    ),
);
