import { createFileRoute } from '@tanstack/react-router';

import { z } from 'zod';

import { ChatView } from '@mods/contact-message/views/private';

export const Route = createFileRoute('/_private/chat/$brandId/')({
    validateSearch: z.object({
        id: z.string().optional(),
    }),

    component: ChatView,
});
