import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const getBrand = protectedEndpoint
    .input(z.object({ id: z.string() }))
    .query(
        queryMutationCallback(async ({ input: { id }, db }) => {
            const { error, data: brand } = await catchError(
                db.query.brand.findFirst({
                    where: (record, { eq }) => eq(record.id, id),

                    columns: {
                        id: true,
                        name: true,
                        description: true,
                        industry: true,
                        companySize: true,
                        foundedYear: true,
                        organizationId: true,
                        brandVoiceId: true,
                        brandMarketId: true,
                        defaultAssistantId: true,
                    },
                }),
            );

            if (error) return Error();

            if (brand === undefined) return Error('BRAND_NOT_FOUND');

            return Success(brand);
        }),
    );
