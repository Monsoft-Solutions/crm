import { ReactElement } from 'react';

import { EmailVerificationFailedCard } from '@shared/components/email-verification-failed-card.component';

// Verify email view
export function EmailVerificationFailedView(): ReactElement {
    return (
        <main className="container grid h-screen items-center justify-center">
            {<EmailVerificationFailedCard />}
        </main>
    );
}
