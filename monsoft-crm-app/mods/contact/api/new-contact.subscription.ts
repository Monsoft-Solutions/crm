import { protectedEndpoint, subscribe } from '@api/providers/server';

import { z } from 'zod';

export const onNewContact = protectedEndpoint
    .input(
        z.object({
            brandId: z.string(),
        }),
    )
    .subscription(
        subscribe(
            'newContact',

            ({
                input: { brandId },

                data: contact,
            }) => {
                if (contact.brandId !== brandId) return;

                return contact;
            },
        ),
    );
