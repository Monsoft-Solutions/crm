import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@css/utils';

const Textarea = forwardRef<
    HTMLTextAreaElement,
    ComponentPropsWithoutRef<'textarea'>
>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                'border-input placeholder:text-muted-foreground focus-visible:shadow-input-focus hover:border-foreground/20 focus-visible:border-primary flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-all duration-200 focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';

export { Textarea };
