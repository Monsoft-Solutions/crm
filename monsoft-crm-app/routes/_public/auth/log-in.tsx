import { z } from 'zod';

import { createFileRoute, redirect } from '@tanstack/react-router';

import { LogInView } from '@shared/views/log-in.view';

// ----------------------------------------------------------------------

// log-in view search schema
const validateSearch = z.object({
    // path to return to after successful log-in
    returnTo: z.string().catch('/'),

    // pre-filled email
    email: z.string().optional(),
});

export const Route = createFileRoute('/_public/auth/log-in')({
    validateSearch,

    beforeLoad({ context: { loggedInUser }, search: { returnTo } }) {
        // if not logged-in, don't do anything here
        if (!loggedInUser) return;
        // otherwise...

        // get clean return-to path, without trailing `?`
        const returnToClean =
            returnTo.at(-1) === '?' ? returnTo.slice(0, -1) : returnTo;

        // redirect to return-to path
        throw redirect({ to: returnToClean });
    },

    component: LogInView,
});
