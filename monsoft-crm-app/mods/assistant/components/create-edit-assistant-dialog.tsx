import { HTMLAttributes, useState } from 'react';

import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@shared/ui/dialog.ui';

import { Assistant } from '../schemas';

import { AssistantForm } from './assistant-form.component';

type CreateEditAssistantDialogProps = {
    onSuccess: () => void;
} & (
    | {
          assistant?: never;
          brandId: string;
      }
    | {
          id: string;
          assistant: Assistant;
          brandId?: never;
      }
);

export function CreateEditAssistantDialog({
    id,
    brandId,
    assistant,
    onSuccess,
    children,
}: HTMLAttributes<HTMLButtonElement> & CreateEditAssistantDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSuccess = () => {
        onSuccess();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Assistant</DialogTitle>
                    <DialogDescription hidden />
                </DialogHeader>

                {assistant ? (
                    <AssistantForm
                        id={id}
                        assistant={assistant}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <AssistantForm
                        brandId={brandId}
                        onSuccess={handleSuccess}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
