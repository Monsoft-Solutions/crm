import { ReactElement } from 'react';

import { NotFoundCard } from '@shared/components/not-found-card.component';

// not-found view
export function NotFoundView(): ReactElement {
    return (
        // render a centered not-found card
        <main className="container grid h-screen items-center justify-center">
            {<NotFoundCard />}
        </main>
    );
}
