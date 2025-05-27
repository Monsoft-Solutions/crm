import { v4 as uuidv4 } from 'uuid';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { db } from '@db/providers/server';
import tables from '@db/db';

import { createContactSchema } from '../schemas';

export const createContact = protectedEndpoint
    .input(createContactSchema)
    .mutation(
        queryMutationCallback(
            async ({ input: { brandId, firstName, lastName } }) => {
                const id = uuidv4();

                const contact = { id, brandId, firstName, lastName };

                const { error } = await catchError(
                    db.insert(tables.contact).values(contact),
                );

                if (error) return Error();

                return Success();
            },
        ),
    );
