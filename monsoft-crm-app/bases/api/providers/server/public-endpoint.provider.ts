import { endpoint } from './endpoint.provider';

// Utility to create a public tRPC endpoint
export const publicEndpoint = endpoint.use(
    async ({ ctx: { session }, next }) => {
        return next({
            ctx: { session },
        });
    },
);
