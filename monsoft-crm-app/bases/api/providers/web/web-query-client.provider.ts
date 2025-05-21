import { QueryClient } from '@tanstack/react-query';

// Centralized client-side query client
export const webQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
        },
    },
});
