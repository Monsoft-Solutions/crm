import { HtmlHTMLAttributes } from 'react';

import { cn } from '@css/utils';

import { LoaderIcon } from 'lucide-react';

export function Spinner({ className }: HtmlHTMLAttributes<HTMLDivElement>) {
    return (
        <div className="grid h-full w-full place-content-center self-center">
            <LoaderIcon className={cn('animate-spin', className)} />
        </div>
    );
}
