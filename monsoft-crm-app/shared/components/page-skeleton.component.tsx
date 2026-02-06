import { ReactElement } from 'react';

import { cn } from '@css/utils';

import { Skeleton } from '@ui/skeleton.ui';

type PageSkeletonProps = {
    className?: string;
};

export function PageSkeleton({ className }: PageSkeletonProps): ReactElement {
    return (
        <div className={cn('flex flex-col gap-6 p-6', className)}>
            {/* Header skeleton */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>

            {/* Content skeleton */}
            <div className="flex flex-col gap-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
