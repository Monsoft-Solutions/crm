import { useState, useRef, useEffect } from 'react';

import { Check, X, Loader } from 'lucide-react';

import { Button } from '@ui/button.ui';
import { Input } from '@ui/input.ui';

type EditableTextProps = {
    initialText: string;
    onSave?: (newText: string) => void | Promise<void>;
    append?: string;
};

export function EditableText(
    { initialText, onSave, append = '' }: EditableTextProps = {
        initialText: 'Double-click to edit',
    },
) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);
    const inputRef = useRef<HTMLInputElement>(null);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
        if (e.key === 'Escape') {
            setText(initialText);
            handleBlur();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleSave = async () => {
        setIsEditing(false);

        if (onSave) {
            setIsSaving(true);
            await onSave(text);
            setIsSaving(false);
        }
    };

    return (
        <div
            className="inline-flex items-center gap-2"
            onDoubleClick={handleDoubleClick}
        >
            {isEditing ? (
                <Input
                    ref={inputRef}
                    value={text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="focus-visible:bg-muted -mx-2 mr-2 border-transparent p-2 focus-visible:ring-transparent focus-visible:outline-none"
                    aria-label="Edit text"
                />
            ) : (
                <p
                    className="-mx-2 mr-2 flex max-w-full grow cursor-text items-center overflow-hidden rounded-md border border-transparent p-2 transition-colors hover:bg-gray-100"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleDoubleClick();
                        }
                    }}
                    aria-label="Double-click to edit"
                >
                    {`${text} ${append}`}
                </p>
            )}

            {text !== initialText && (
                <>
                    <Button
                        variant="default"
                        size="sm"
                        className="size-4 shrink-0 rounded-full px-0 py-0"
                        onClick={() => {
                            void handleSave();
                        }}
                    >
                        {isSaving ? (
                            <Loader className="size-3 animate-spin" />
                        ) : (
                            <Check className="size-3" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-destructive size-4 shrink-0 rounded-full px-0 py-0"
                        onClick={() => {
                            setText(initialText);
                        }}
                    >
                        <X className="size-3" />
                    </Button>
                </>
            )}
        </div>
    );
}
