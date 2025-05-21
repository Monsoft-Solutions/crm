import { ReactElement } from 'react';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/ui/card.ui';

export function WaitingEmailVerificationCard(): ReactElement {
    return (
        <Card className="mx-auto max-w-96">
            <CardHeader>
                <CardTitle>Verify your email</CardTitle>

                <CardDescription>
                    We&apos;ve sent you an email to verify your address. Please
                    click the verification button. <br />
                    <strong>You can now close this tab.</strong>
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
