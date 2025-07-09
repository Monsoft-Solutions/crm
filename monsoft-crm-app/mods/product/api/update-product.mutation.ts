import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { z } from 'zod';

import { db } from '@db/providers/server';

import { eq } from 'drizzle-orm';

import { catchError } from '@errors/utils/catch-error.util';

import { product } from '../db';
import { productStatusEnum } from '../enums';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const updateProduct = protectedEndpoint
    .input(
        z.object({
            id: z.string(),
            name: z.string().optional(),
            description: z.string().optional(),
            sku: z.string().optional(),
            price: z.number().optional(),
            stock: z.number().optional(),
            status: productStatusEnum.optional(),
        }),
    )
    .mutation(
        queryMutationCallback(async ({ input: { id, ...updates } }) => {
            // prepare update data with timestamp
            const updateData = {
                ...updates,
                updatedAt: Date.now(),
            };

            // update the product in db
            const { error } = await catchError(
                db.update(product).set(updateData).where(eq(product.id, id)),
            );

            if (error) return Error();

            return Success();
        }),
    );
