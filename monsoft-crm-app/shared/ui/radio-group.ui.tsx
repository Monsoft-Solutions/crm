import { ComponentProps } from 'react';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { CircleIcon } from 'lucide-react';

import { cn } from '@css/utils';

function RadioGroup({
    className,
    ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return (
        <RadioGroupPrimitive.Root
            data-slot="radio-group"
            className={cn('grid gap-3', className)}
            {...props}
        />
    );
}

function RadioGroupItem({
    className,
    ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <div className="h-4 w-4">
            <RadioGroupPrimitive.Item
                data-slot="radio-group-item"
                className={cn(
                    'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 relative aspect-square shrink-0 translate-x-2 -translate-y-2 rounded-full shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                {...props}
            >
                <div className="border-primary absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border" />
                <RadioGroupPrimitive.Indicator
                    data-slot="radio-group-indicator"
                    className="relative flex items-center justify-center"
                >
                    <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
                </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
        </div>
    );
}

export { RadioGroup, RadioGroupItem };
