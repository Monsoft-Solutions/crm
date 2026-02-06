import { ReactElement, ReactNode } from 'react';

import { LucideIcon } from 'lucide-react';

import { cn } from '@css/utils';

type EmptyStateProps = {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
};

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps): ReactElement {
    return (
        <div
            className={cn(
                'border-border/60 bg-muted/30 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-6 py-16 text-center',
                className,
            )}
        >
            <div className="bg-muted/60 flex size-14 items-center justify-center rounded-2xl">
                <Icon className="text-muted-foreground size-6" />
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="text-foreground text-base font-medium">
                    {title}
                </h3>
                {description && (
                    <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
