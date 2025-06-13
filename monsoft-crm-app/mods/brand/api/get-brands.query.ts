import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { db } from '@db/providers/server';

export const getBrands = protectedEndpoint.query(
    queryMutationCallback(
        async ({
            ctx: {
                session: { user },
            },
        }) => {
            const { error, data: brands } = await catchError(
                db.query.brand.findMany({
                    columns: {
                        id: true,
                        name: true,
                    },
                    where: (record, { eq }) =>
                        eq(record.organizationId, user.organizationId),
                }),
            );

            if (error) return Error();

            return Success(brands);
        },
    ),
);
