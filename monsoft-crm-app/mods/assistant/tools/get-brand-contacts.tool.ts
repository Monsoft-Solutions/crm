import { z } from 'zod';

import { tool } from 'ai';

import { catchError } from '@errors/utils/catch-error.util';

import { eq } from 'drizzle-orm';

import { db } from '@db/providers/server';

import tables from '@db/db';

export const getBrandContactsTool = tool({
    parameters: z.object({
        brandId: z
            .string()
            .describe('The id of the brand to get the contacts from'),
    }),

    description:
        'Use the tool to get the contacts of a brand. It will return the array of contacts.',

    execute: async ({ brandId }) => {
        const { data: contacts, error: contactsError } = await catchError(
            db.query.contact.findMany({
                where: eq(tables.contact.brandId, brandId),
            }),
        );

        if (contactsError) return 'FAIL_TO_GET_CONTACTS';

        return contacts;
    },
});
