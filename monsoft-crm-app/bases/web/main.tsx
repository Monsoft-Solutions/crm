import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import * as Sentry from '@sentry/react';

import { App } from './app';

import { z } from 'zod';

const { hostname } = window.location;

const dsn = z.string().parse('');

Sentry.init({
    dsn,
    // enabled: hostname !== 'localhost',

    // use the hostname as environment tag
    // so different deployments platforms can be easily identified
    environment: hostname,

    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),

        // Sentry.feedbackIntegration({
        //     triggerLabel: '',
        //     formTitle: 'Report anything !',
        //     submitButtonLabel: 'Submit',
        //     messageLabel: 'Brief explanation',
        //     messagePlaceholder:
        //         'Please describe what you want to report: \n- feature request, found bug, or improvement suggestion?\n- all specific details you can provide \n- priority low, medium, high?',

        //     // Additional SDK configuration goes in here, for example:
        //     colorScheme: 'system',
        //     showName: false,
        //     showEmail: false,
        //     useSentryUser: {
        //         id: 'id',
        //         name: 'name',
        //         email: 'email',
        //     },
        // }),
    ],

    // Tracing
    tracesSampleRate: hostname === 'localhost' ? 0.2 : 0.3, // Lower sample rate in production
    tracePropagationTargets: [],

    // Session Replay
    replaysSessionSampleRate: hostname === 'localhost' ? 0.2 : 0.6, // Lower sample rate in production
    replaysOnErrorSampleRate: 1.0,
});

// get element to mount app root component into
const rootElement = document.getElementById('app');

// if element exists and is empty
// mount app root component into it
if (rootElement && !rootElement.innerHTML) {
    // create react root
    const root = createRoot(rootElement);

    // render app root component
    root.render(
        // use strict mode to detect potential issues in development
        // not used in production
        <StrictMode>
            {/* app root component */}
            <App />
        </StrictMode>,
    );
}
