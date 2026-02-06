import { HTMLAttributes, useState } from 'react';

import { Button } from '@ui/button.ui';
import { Switch } from '@ui/switch.ui';
import { Spinner } from '@ui/spinner.ui';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@ui/dialog.ui';

export function ViewEditDialog({
    title,
    render,
    onSubmit,
    isOpen,
    handleOpenChange,
    initEditMode = false,
    newEntityCreation = false,
    children,
}: HTMLAttributes<HTMLDivElement> & {
    title: string;
    onSubmit?: () => void | Promise<void>;
    isOpen: boolean;
    handleOpenChange: (open: boolean) => void;
    render: ({
        isEditMode,
        setIsSubmitting,
    }: {
        isEditMode: boolean;
        setIsSubmitting: (isSubmitting: boolean) => void;
    }) => React.ReactNode;
    initEditMode?: boolean;
    newEntityCreation?: boolean;
}) {
    const [isEditMode, setIsEditMode] = useState(initEditMode);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            await onSubmit?.();
            setIsSubmitting(false);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            return;
        }

        handleOpenChange(false);
    };

    return (
        <Dialog onOpenChange={handleOpenChange} open={isOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="border-border block max-h-[90vh] w-[90vw] max-w-none overflow-y-auto rounded-lg p-6 shadow-lg md:w-[80vw] lg:w-[60vw] lg:max-w-[800px] lg:p-6">
                <DialogHeader className="mb-10">
                    <DialogTitle className="text-left">{title}</DialogTitle>

                    {!newEntityCreation && (
                        <div className="absolute top-2 right-14 z-10 flex items-center gap-2">
                            <span className="text-sm font-medium transition-all duration-300">
                                {isEditMode ? 'Edit Mode' : 'View Mode'}
                            </span>

                            <Switch
                                id="edit-mode-switch"
                                checked={isEditMode}
                                onCheckedChange={setIsEditMode}
                            />
                        </div>
                    )}
                </DialogHeader>

                {render({ isEditMode, setIsSubmitting })}

                {isEditMode && (
                    <div className="mt-4 flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsEditMode(false);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            onClick={() => {
                                void handleSubmit();
                            }}
                        >
                            {isSubmitting ? <Spinner /> : 'Save'}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
