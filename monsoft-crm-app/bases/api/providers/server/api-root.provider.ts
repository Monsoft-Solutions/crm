import { mergeEndpoints } from './api-merge.provider';
import { endpoints } from './endpoints.provider';

import { authApi } from '@auth/api';

import * as appEndpoints from '@app/api';

// full app api
export const appApi = endpoints(appEndpoints);

// Root API router connecting to all endpoints
export const apiRoot = mergeEndpoints(
    appApi,

    endpoints({
        auth: authApi,
    }),
);
