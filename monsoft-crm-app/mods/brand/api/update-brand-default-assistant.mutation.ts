import { eq } from 'drizzle-orm';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import tables from '@db/db';

import { updateBrandDefaultAssistantSchema } from '../schemas';

export const updateBrandDefaultAssistant = protectedEndpoint
    .input(updateBrandDefaultAssistantSchema)
    .mutation(
        queryMutationCallback(
            async ({ input: { brandId, defaultAssistantId }, db }) => {
                const { error } = await catchError(
                    db
                        .update(tables.brand)
                        .set({ defaultAssistantId })
                        .where(eq(tables.brand.id, brandId)),
                );

                if (error) return Error();

                return Success();
            },
        ),
    );
