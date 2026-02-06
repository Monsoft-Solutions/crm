import { cn } from '@css/utils';

import { SidebarTrigger, useSidebar } from '@shared/ui/sidebar.ui';

export function Main({ children }: { children: React.ReactNode }) {
    const { isMobile } = useSidebar();

    return (
        <main className="relative flex flex-1 flex-col overflow-y-auto px-4">
            <div className="animate-page-enter relative flex h-full flex-col">
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
