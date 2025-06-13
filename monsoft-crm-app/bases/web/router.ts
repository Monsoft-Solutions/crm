import { createRouter, ToOptions } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import { NotFoundView } from '@shared/views/not-found.view';
// import { trackPageView } from '@analytics/providers';

// create router instance
export const router = createRouter({
    // route tree
    routeTree,

    // default preload strategy
    defaultPreload: 'intent',

    defaultNotFoundComponent: NotFoundView,
});

// Subscribe to router events for page view tracking
// router.subscribe('onResolved', (event: { toLocation: { href: string } }) => {
//     // onResolved implies successful resolution, track page view using href
//     trackPageView(event.toLocation.href);
// });

declare module '@tanstack/react-router' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export interface Register {
        router: typeof router;
    }
}

export type HRef = ToOptions['to'];
