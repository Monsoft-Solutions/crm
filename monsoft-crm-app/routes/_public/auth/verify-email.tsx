import { createFileRoute, redirect } from '@tanstack/react-router';

import { z } from 'zod';

import { toast } from 'sonner';

import { authClient } from '@auth/providers/web';

import { EmailVerificationFailedView } from '@shared/views/email-verification-failed.view';

// ----------------------------------------------------------------------

const validateSearch = z.object({
    // path to return to after successful log-in
    id: z.string(),
});

export const Route = createFileRoute('/_public/auth/verify-email')({
    validateSearch,

    beforeLoad: async (ctx) => {
        const verifyEmailResult = await authClient.verifyEmail({
            query: {
                token: ctx.search.id,
            },
        });

        if (!verifyEmailResult.error) {
            toast.success('Welcome to Monsoft CRM !');

            throw redirect({
                to: '/',
            });
        }
    },

    component: EmailVerificationFailedView,
});
