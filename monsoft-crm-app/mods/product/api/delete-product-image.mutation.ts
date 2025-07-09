import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { z } from 'zod';

import { db } from '@db/providers/server';

import { eq } from 'drizzle-orm';

import { catchError } from '@errors/utils/catch-error.util';

import tables from '@db/db';

import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const deleteProductImage = protectedEndpoint
    .input(
        z.object({
            id: z.string(),
        }),
    )
    .mutation(
        queryMutationCallback(async ({ input: { id } }) => {
            // delete the product image from db
            const { error } = await catchError(
                db
                    .delete(tables.productImage)
                    .where(eq(tables.productImage.id, id)),
            );

            if (error) return Error();

            return Success();
        }),
    );
