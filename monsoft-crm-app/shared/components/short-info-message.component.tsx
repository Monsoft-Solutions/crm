import { HTMLAttributes } from 'react';

import { Info } from 'lucide-react';

// component used to render a short informational message
export function ShortInfoMessage({
    children,
}: HTMLAttributes<HTMLSpanElement>) {
    return (
        <div className="flex items-center gap-2">
            <Info className="size-4 stroke-blue-500" />{' '}
            <span className="italic">{children}</span>
        </div>
    );
}
