import { ReactElement } from 'react';

import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { Toaster } from '@shared/ui/toaster.ui';

import { trpcReact, apiClient, webQueryClient } from '@api/providers/web';

import { router } from './router';

import '../../theme/theme.css';

// web app root component
export function App(): ReactElement {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* api provider */}
            <trpcReact.Provider client={apiClient} queryClient={webQueryClient}>
                {/* query client provider */}
                <QueryClientProvider client={webQueryClient}>
                    {/* router provider */}
                    <RouterProvider router={router} />
                </QueryClientProvider>
            </trpcReact.Provider>

            {/* toaster */}
            <Toaster position="top-center" />
        </ThemeProvider>
    );
}
