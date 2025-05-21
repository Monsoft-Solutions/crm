import { ReactElement } from 'react';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/ui/card.ui';

export function EmailVerificationFailedCard(): ReactElement {
    return (
        <Card className="mx-auto max-w-96">
            <CardHeader>
                <CardTitle>Email verification failed</CardTitle>

                <CardDescription>
                    This email verification link is invalid, expired, or has
                    already been used. Please try requesting a new one.
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
