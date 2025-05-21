import { createFileRoute } from '@tanstack/react-router';

import { WaitingEmailVerificationView } from '@shared/views/waiting-email-verification.view';

// ----------------------------------------------------------------------

export const Route = createFileRoute(
    '/_public/auth/waiting-email-verification',
)({
    component: WaitingEmailVerificationView,
});
