import {
    useEffect,
    useState,
    useImperativeHandle,
    useRef,
    forwardRef,
    TextareaHTMLAttributes,
    Ref,
} from 'react';

import { cn } from '@css/utils';

type UseAutosizeTextAreaProps = {
    textAreaRef: HTMLTextAreaElement | null;
    minHeight?: number;
    maxHeight?: number;
    triggerAutoSize: string;
};

export const useAutosizeTextArea = ({
    textAreaRef,
    triggerAutoSize,
    maxHeight = Number.MAX_SAFE_INTEGER,
    minHeight = 0,
}: UseAutosizeTextAreaProps) => {
    const [init, setInit] = useState(true);
    useEffect(() => {
        const offsetBorder = 2;
        if (textAreaRef) {
            if (init) {
                textAreaRef.style.minHeight = `${(minHeight + offsetBorder).toString()}px`;
                if (maxHeight > minHeight) {
                    textAreaRef.style.maxHeight = `${maxHeight.toString()}px`;
                }
                setInit(false);
            }
            textAreaRef.style.height = `${(minHeight + offsetBorder).toString()}px`;
            const scrollHeight = textAreaRef.scrollHeight;

            if (scrollHeight > maxHeight) {
                textAreaRef.style.height = `${maxHeight.toString()}px`;
            } else {
                textAreaRef.style.height = `${(scrollHeight + offsetBorder).toString()}px`;
            }
        }
    }, [textAreaRef, triggerAutoSize, init, maxHeight, minHeight]);
};

export type AutosizeTextAreaRef = {
    textArea: HTMLTextAreaElement;
    maxHeight: number;
    minHeight: number;
};

type AutosizeTextAreaProps = {
    maxHeight?: number;
    minHeight?: number;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaAutosize = forwardRef<
    AutosizeTextAreaRef,
    AutosizeTextAreaProps
>(
    (
        {
            maxHeight = Number.MAX_SAFE_INTEGER,
            minHeight = 52,
            className,
            onChange,
            value,
            ...props
        }: AutosizeTextAreaProps,
        ref: Ref<AutosizeTextAreaRef>,
    ) => {
        const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
        const [triggerAutoSize, setTriggerAutoSize] = useState('');

        useAutosizeTextArea({
            textAreaRef: textAreaRef.current,
            triggerAutoSize: triggerAutoSize,
            maxHeight,
            minHeight,
        });

        useImperativeHandle(ref, () => ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            textArea: textAreaRef.current!,
            focus: () => textAreaRef.current?.focus(),
            maxHeight,
            minHeight,
        }));

        useEffect(() => {
            setTriggerAutoSize(value as string);
        }, [props.defaultValue, value]);

        return (
            <textarea
                {...props}
                value={value}
                ref={textAreaRef}
                className={cn(
                    'custom-scrollbar border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:shadow-floating flex w-full rounded-md border p-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                onChange={(e) => {
                    setTriggerAutoSize(e.target.value);
                    onChange?.(e);
                }}
            />
        );
    },
);

TextareaAutosize.displayName = 'AutosizeTextarea';
