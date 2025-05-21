import { unauthorizedError } from '../../errors';

import { publicEndpoint } from './public-endpoint.provider';

// Utility to create a protected tRPC endpoint
export const protectedEndpoint = publicEndpoint.use(
    ({ ctx: { session }, next }) => {
        if (!session) {
            throw unauthorizedError;
        }

        return next({
            ctx: { session },
        });
    },
);
