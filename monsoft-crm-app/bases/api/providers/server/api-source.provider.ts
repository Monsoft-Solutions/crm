import { initTRPC } from '@trpc/server';

import type { ApiContext } from '../../types/server';

// tRPC source initialized with api context
export const apiSource = initTRPC.context<ApiContext>().create({});
