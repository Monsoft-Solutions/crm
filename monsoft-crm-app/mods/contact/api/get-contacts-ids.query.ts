import { z } from 'zod';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { db } from '@db/providers/server';

export const getContactsIds = protectedEndpoint
    .input(
        z.object({
            brandId: z.string(),
        }),
    )
    .query(
        queryMutationCallback(async ({ input: { brandId } }) => {
            const { error, data: contacts } = await catchError(
                db.query.contact.findMany({
                    columns: {
                        id: true,
                    },
                    where: (record, { eq }) => eq(record.brandId, brandId),
                }),
            );

            if (error) return Error();

            return Success(contacts);
        }),
    );
