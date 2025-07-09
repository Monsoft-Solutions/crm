import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { z } from 'zod';

import { db } from '@db/providers/server';

import { catchError } from '@errors/utils/catch-error.util';

import { v4 as uuidv4 } from 'uuid';

import tables from '@db/db';

import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

export const createProduct = protectedEndpoint
    .input(
        z.object({
            brandId: z.string(),
            name: z.string(),
            description: z.string().optional(),
            sku: z.string(),
            price: z.number(),
            stock: z.number(),
        }),
    )
    .mutation(
        queryMutationCallback(
            async ({
                input: { name, description, sku, brandId, price, stock },
            }) => {
                // generate a unique id for the product
                const id = uuidv4();

                // create the product object
                const newProduct = {
                    id,
                    brandId,
                    name,
                    description,
                    sku,
                    price,
                    stock,
                };

                // insert the product into db
                const { error } = await catchError(
                    db.insert(tables.product).values(newProduct),
                );

                if (error) return Error();

                return Success();
            },
        ),
    );
