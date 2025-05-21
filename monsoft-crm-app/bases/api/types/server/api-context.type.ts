import type { apiContext } from '@api/providers/server';

// Server-side API context type
export type ApiContext = Awaited<ReturnType<typeof apiContext>>;
