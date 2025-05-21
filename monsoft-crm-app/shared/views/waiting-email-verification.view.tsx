import { ReactElement } from 'react';

import { WaitingEmailVerificationCard } from '@shared/components/waiting-email-verification-card.component';

// Verify email view
export function WaitingEmailVerificationView(): ReactElement {
    return (
        <main className="container grid h-screen items-center justify-center">
            {<WaitingEmailVerificationCard />}
        </main>
    );
}
