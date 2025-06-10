import { z } from 'zod';

import {
    httpLink,
    loggerLink,
    splitLink,
    unstable_httpSubscriptionLink,
} from '@trpc/react-query';

import { trpcReact } from './trpc-react.provider';

// polyfill EventSource
import { EventSourcePolyfill } from 'event-source-polyfill';
globalThis.EventSource = EventSourcePolyfill as unknown as typeof EventSource;

import { apiPath } from '@api/constants';

import { throwAsync } from '@errors/utils';

// tRPC client
export const apiClient = trpcReact.createClient({
    links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
            enabled: () => window.location.hostname === 'localhost',
        }),

        splitLink({
            // uses the httpSubscriptionLink for subscriptions
            condition: (op) => op.type === 'subscription',

            true: unstable_httpSubscriptionLink({
                url: apiPath,

                eventSourceOptions: () => {
                    return {
                        heartbeatTimeout: Number.MAX_SAFE_INTEGER,
                    } as EventSourceInit;
                },
            }),

            false: httpLink({
                url: apiPath,

                async fetch(url, options) {
                    const response = await fetch(url, options);

                    const body: unknown = JSON.parse(await response.text());

                    const errorSchema = z.object({
                        error: z.object({
                            data: z.object({ code: z.string() }),
                        }),
                        result: z.undefined(),
                    });

                    const successSchema = z.object({
                        result: z.object({
                            data: z.object({
                                data: z.unknown(),
                                error: z.string().or(z.null()),
                            }),
                        }),
                        error: z.undefined(),
                    });

                    const schema = errorSchema.or(successSchema);

                    const parsing = schema.safeParse(body);

                    const data = !parsing.success
                        ? { error: 'BAD_RESPONSE', data: null }
                        : parsing.data.error
                          ? { error: parsing.data.error.data.code, data: null }
                          : parsing.data.result.data;

                    const { error } = data;

                    if (error) throwAsync(error);

                    const formatted: z.infer<typeof successSchema> = {
                        result: {
                            data,
                        },
                    };

                    return new Response(JSON.stringify(formatted));
                },
            }),
        }),
    ],
});
