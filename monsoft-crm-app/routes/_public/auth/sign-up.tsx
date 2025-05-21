import { createFileRoute } from '@tanstack/react-router';

import { SignUpView } from '@shared/views/sign-up.view';

// ----------------------------------------------------------------------

export const Route = createFileRoute('/_public/auth/sign-up')({
    component: SignUpView,
});
