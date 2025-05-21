import { createTRPCReact } from '@trpc/react-query';

import { ApiRoot } from '@api/types/web';

// tRPC-React provider
export const api = createTRPCReact<ApiRoot>();
