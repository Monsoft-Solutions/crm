import { cn } from '@css/utils';

import { SidebarTrigger, useSidebar } from '@shared/ui/sidebar.ui';

export function Main({ children }: { children: React.ReactNode }) {
    const { isMobile } = useSidebar();

    return (
        <main className="relative grow px-4 py-12">
            <div className="relative flex h-full items-center justify-center">
                {children}
            </div>

            <SidebarTrigger
                className={cn(
                    'absolute top-4 -left-4 z-50 -translate-x-full',
                    isMobile && 'left-4 translate-x-0',
                )}
            />
        </main>
    );
}
