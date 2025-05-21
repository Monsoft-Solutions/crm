import { ReactElement } from 'react';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/ui/card.ui';

// card shown when a user tries to access a non-found private page
export function NotFoundCard(): ReactElement {
    return (
        <Card className="mx-auto max-w-96">
            <CardHeader>
                <CardTitle>Page not found</CardTitle>

                <CardDescription>
                    The page you were looking for could not be found. Please
                    double check the URL.
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
