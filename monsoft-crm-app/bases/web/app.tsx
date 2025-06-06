import { ReactElement } from 'react';

import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from '@shared/ui/toaster.ui';

import { api, apiClient, webQueryClient } from '@api/providers/web';

import { router } from './router';

import '../../theme/theme.css';

// web app root component
export function App(): ReactElement {
    return (
        <>
            {/* api provider */}
            <api.Provider client={apiClient} queryClient={webQueryClient}>
                {/* query client provider */}
                <QueryClientProvider client={webQueryClient}>
                    {/* router provider */}
                    <RouterProvider router={router} />
                </QueryClientProvider>
            </api.Provider>

            {/* toaster */}
            <Toaster position="top-center" />
        </>
    );
}
