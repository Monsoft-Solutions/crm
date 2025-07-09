import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { z } from 'zod';

import { db } from '@db/providers/server';

import { and, eq, like, desc } from 'drizzle-orm';

import { catchError } from '@errors/utils/catch-error.util';

import tables from '@db/db';

import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { productStatusEnum } from '../enums';

export const getProducts = protectedEndpoint
    .input(
        z.object({
            brandId: z.string().optional(),
            status: productStatusEnum.optional(),
            search: z.string().optional(),
        }),
    )
    .query(
        queryMutationCallback(
            async ({ input: { search, status, brandId } }) => {
                // build array of where conditions
                const whereConditions = [];

                if (search)
                    whereConditions.push(
                        like(tables.product.name, `%${search}%`),
                    );

                if (status)
                    whereConditions.push(eq(tables.product.status, status));

                if (brandId)
                    whereConditions.push(eq(tables.product.brandId, brandId));

                // get products that match the where conditions
                const { data: products, error } = await catchError(
                    db.query.product.findMany({
                        with: {
                            brand: true,
                        },

                        where:
                            whereConditions.length > 0
                                ? and(...whereConditions)
                                : undefined,

                        orderBy: desc(tables.product.createdAt),
                    }),
                );

                if (error) return Error();

                return Success(products);
            },
        ),
    );
