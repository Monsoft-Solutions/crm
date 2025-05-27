import { v4 as uuidv4 } from 'uuid';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { db } from '@db/providers/server';
import { brandTable } from '../db';

import { createBrandSchema } from '../schemas';

export const createBrand = protectedEndpoint.input(createBrandSchema).mutation(
    queryMutationCallback(
        async ({
            ctx: {
                session: {
                    user: { organizationId },
                },
            },
            input: { name },
        }) => {
            const id = uuidv4();

            const brand = { id, name, organizationId };

            const { error } = await catchError(
                db.insert(brandTable).values(brand),
            );

            if (error) return Error();

            return Success();
        },
    ),
);
