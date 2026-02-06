import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@css/utils';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'bg-card text-card-foreground border-border/40 rounded-xl border p-6 shadow-md transition-all duration-200 hover:shadow-lg',
                className,
            )}
            {...props}
        />
    ),
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('mb-4 flex flex-col space-y-1.5', className)}
            {...props}
        />
    ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
    HTMLParagraphElement,
    HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            'text-lg leading-snug font-semibold tracking-[-0.02em]',
            className,
        )}
        {...props}
    >
        {children}
    </h3>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
    HTMLParagraphElement,
    HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-muted-foreground text-sm', className)}
        {...props}
    />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('pt-0', className)} {...props} />
    ),
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center pt-6', className)}
            {...props}
        />
    ),
);
CardFooter.displayName = 'CardFooter';

export {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
};
