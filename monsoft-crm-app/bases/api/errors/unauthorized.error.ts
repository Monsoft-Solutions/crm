import { TRPCError } from '@trpc/server';

// Error thrown when unauthorized access is attempted
export const unauthorizedError = new TRPCError({
    code: 'UNAUTHORIZED',
    message: 'You are not authorized to access this resource.',
});
