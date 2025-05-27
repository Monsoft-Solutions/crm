import { mergeEndpoints } from './api-merge.provider';
import { endpoints } from './endpoints.provider';

import * as appEndpoints from '@app/api';

// full app api
export const appApi = endpoints(appEndpoints);

// Root API router connecting to all endpoints
export const apiRoot = mergeEndpoints(appApi);
