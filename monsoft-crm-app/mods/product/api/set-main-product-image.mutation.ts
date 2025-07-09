import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { z } from 'zod';

import { eq } from 'drizzle-orm';

import { db } from '@db/providers/server';

import { catchError } from '@errors/utils/catch-error.util';

import tables from '@db/db';

import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const setMainProductImage = protectedEndpoint
    .input(
        z.object({
            imageId: z.string(),
        }),
    )
    .mutation(
        queryMutationCallback(async ({ input: { imageId } }) => {
            // check if the image exists and belongs to the product
            const { data: existingImage, error: findError } = await catchError(
                db.query.productImage.findFirst({
                    where: eq(tables.productImage.id, imageId),
                }),
            );

            if (findError) return Error();

            if (!existingImage) return Error('PRODUCT_IMAGE_NOT_FOUND');

            const { productId } = existingImage;

            // first, unset all other images as main for this product
            const { error: unsetError } = await catchError(
                db
                    .update(tables.productImage)
                    .set({ isMain: null })
                    .where(eq(tables.productImage.productId, productId)),
            );

            if (unsetError) return Error();

            // then set the specified image as main
            const { error: setError } = await catchError(
                db
                    .update(tables.productImage)
                    .set({ isMain: 'true' })
                    .where(eq(tables.productImage.id, imageId)),
            );

            if (setError) return Error();

            return Success();
        }),
    );
