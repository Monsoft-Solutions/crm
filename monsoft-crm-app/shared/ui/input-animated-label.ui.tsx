import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

import { cn } from '@css/utils';

import { Input } from './input.ui';
import { AutosizeTextAreaRef, TextareaAutosize } from './text-area-autosize.ui';

type BaseProps = {
    label: string;
    maxHeight?: number;
    minHeight?: number;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    labelBackgroundClassName?: string;
    showFloatingLabel?: boolean;
};

type TextInputProps = BaseProps &
    InputHTMLAttributes<HTMLInputElement> & {
        inputType?: 'text';
    };

type TextareaProps = BaseProps &
    TextareaHTMLAttributes<HTMLTextAreaElement> & {
        inputType: 'textarea';
    };

type AnimatedLabelProps = TextInputProps | TextareaProps;

export const InputAnimatedLabel = forwardRef<
    HTMLInputElement | HTMLTextAreaElement,
    AnimatedLabelProps
>(
    (
        {
            label,
            inputType = 'text',
            maxHeight,
            minHeight,
            containerClassName,
            labelClassName,
            inputClassName,
            labelBackgroundClassName,
            showFloatingLabel = true,
            ...props
        },
        ref,
    ) => {
        // Default styles for different states
        const defaultTextareaLabelClass =
            'origin-start text-foreground absolute -top-2 block cursor-text px-1 text-xs font-medium transition-all';

        const defaultInputLabelClass =
            'origin-start text-gray-500 group-focus-within:text-blue-600 has-[+input:not(:placeholder-shown)]:text-gray-700 absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all duration-200 group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium';

        // Combine default with custom styles
        const finalLabelClassName = showFloatingLabel
            ? cn(
                  inputType === 'textarea'
                      ? defaultTextareaLabelClass
                      : defaultInputLabelClass,
                  labelClassName,
              )
            : cn('sr-only', labelClassName); // Hide label visually but keep for screen readers if floating is disabled

        const finalContainerClassName = cn(
            'group relative',
            containerClassName,
        );

        const finalLabelBackgroundClassName = cn(
            'bg-background inline-flex px-2',
            labelBackgroundClassName,
        );

        const finalInputClassName = cn(inputClassName);

        return (
            <div className={finalContainerClassName}>
                <label htmlFor={label} className={finalLabelClassName}>
                    <span className={finalLabelBackgroundClassName}>
                        {label}
                    </span>
                </label>

                {inputType === 'textarea' ? (
                    <TextareaAutosize
                        ref={ref as React.Ref<AutosizeTextAreaRef>}
                        id={label}
                        placeholder={showFloatingLabel ? '' : label}
                        className={finalInputClassName}
                        {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                        maxHeight={maxHeight}
                        minHeight={minHeight}
                    />
                ) : (
                    <Input
                        ref={ref as React.Ref<HTMLInputElement>}
                        id={label}
                        placeholder={showFloatingLabel ? '' : label}
                        className={finalInputClassName}
                        {...(props as InputHTMLAttributes<HTMLInputElement>)}
                    />
                )}
            </div>
        );
    },
);

InputAnimatedLabel.displayName = 'InputAnimatedLabel';
