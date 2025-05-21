import { throwAsync } from '@errors/utils';

import { createTRPCClient, httpLink, loggerLink } from '@trpc/client';

import { ApiRoot } from '@api/types/web';

import { apiPath } from '@api/constants';

import { webApiHeaders } from './web-api-headers.util';

// Vanilla-JS tRPC client
export const vanillaApi: ReturnType<typeof createTRPCClient<ApiRoot>> =
    createTRPCClient<ApiRoot>({
        links: [
            // adds pretty logs to your console in development and logs errors in production
            loggerLink(),

            httpLink({
                url: apiPath,

                headers: () => {
                    const {
                        data: webApiHeadersData,
                        error: webApiHeadersError,
                    } = webApiHeaders();

                    if (webApiHeadersError) throwAsync(webApiHeadersError);

                    return webApiHeadersError ? {} : webApiHeadersData;
                },
            }),
        ],
    });
