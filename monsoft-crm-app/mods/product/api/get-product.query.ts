import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { z } from 'zod';

import { db } from '@db/providers/server';

import { eq } from 'drizzle-orm';

import { catchError } from '@errors/utils/catch-error.util';

import tables from '@db/db';

import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const getProduct = protectedEndpoint
    .input(
        z.object({
            id: z.string(),
        }),
    )
    .query(
        queryMutationCallback(async ({ input: { id } }) => {
            // get the product with details
            const { data: productData, error } = await catchError(
                db.query.product.findFirst({
                    where: eq(tables.product.id, id),
                    with: {
                        brand: true,
                        images: true,
                    },
                }),
            );

            if (error) return Error();

            if (!productData) return Error('NOT_FOUND');

            const { images: productImages, ...productRest } = productData;

            const images = productImages.map(({ isMain, ...rest }) => ({
                ...rest,
                isMain: !!isMain,
            }));

            const product = {
                ...productRest,
                images,
            };

            // return the product
            return Success(product);
        }),
    );
