import { createTRPCQueryUtils } from '@trpc/react-query';

import { webQueryClient } from './web-query-client.provider';
import { apiClient } from './api-client.provider';

// Centralized client-side tRPC query mannager
export const apiClientUtils = createTRPCQueryUtils({
    queryClient: webQueryClient,
    client: apiClient,
});
