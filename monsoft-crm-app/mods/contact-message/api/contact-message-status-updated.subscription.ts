import { protectedEndpoint, subscribe } from '@api/providers/server';

import { z } from 'zod';

export const onContactMessageStatusUpdated = protectedEndpoint
    .input(
        z.object({
            contactId: z.string(),
        }),
    )
    .subscription(
        subscribe(
            'contactMessageStatusUpdated',
            ({
                input: { contactId },

                data: contactMessage,
            }) => {
                if (contactMessage.contactId !== contactId) return;

                return contactMessage;
            },
        ),
    );
