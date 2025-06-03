import { protectedEndpoint, subscribe } from '@api/providers/server';

import { z } from 'zod';

export const onNewContactMessage = protectedEndpoint
    .input(
        z.object({
            contactId: z.string(),
        }),
    )
    .subscription(
        subscribe(
            'newContactMessage',
            ({
                input: { contactId },

                data: contactMessage,
            }) => {
                if (contactMessage.contactId !== contactId) return;

                return contactMessage;
            },
        ),
    );
