import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { z } from 'zod';

import { db } from '@db/providers/server';

import { eq } from 'drizzle-orm';

import { catchError } from '@errors/utils/catch-error.util';

import { v4 as uuidv4 } from 'uuid';

import tables from '@db/db';

import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const addProductImage = protectedEndpoint
    .input(
        z.object({
            productId: z.string(),
            url: z.string(),
        }),
    )
    .mutation(
        queryMutationCallback(async ({ input: { productId, url } }) => {
            // check if product exists
            const { data: existingProduct, error: findError } =
                await catchError(
                    db.query.product.findFirst({
                        where: eq(tables.product.id, productId),
                    }),
                );

            if (findError) return Error();

            if (!existingProduct) return Error('PRODUCT_NOT_FOUND');

            // generate a unique id for the image
            const id = uuidv4();

            // create the product image object
            const newProductImage = {
                id,
                productId,
                imageUrl: url,
            };

            // insert the product image into db
            const { error } = await catchError(
                db.insert(tables.productImage).values(newProductImage),
            );

            // if insertion failed, return the error
            if (error) return Error();

            return Success();
        }),
    );
