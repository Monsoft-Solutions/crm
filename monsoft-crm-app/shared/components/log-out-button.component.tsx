import { ReactElement } from 'react';

import { Route } from '@routes/__root';

import { Button } from '@shared/ui/button.ui';

// ----------------------------------------------------------------------

// Log out button
// When clicked, log out user
export function LogOutButton(): ReactElement {
    const {
        auth: { logOut },
    } = Route.useRouteContext();

    return (
        <Button variant="destructive" onClick={() => void logOut()}>
            Logout
        </Button>
    );
}
