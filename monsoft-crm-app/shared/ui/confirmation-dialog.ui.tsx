import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '@css/utils';

export type ConfirmationDialogProps = {
    /** Controls open/close state. */
    open: boolean;
    /** Called when the dialog is requested to close. */
    onOpenChange: (open: boolean) => void;
    /** Called when user confirms the action. */
    onConfirm?: () => void;
    /** Called when user cancels the action. */
    onCancel?: () => void;
    /** Title displayed at the top of the dialog. */
    title?: string;
    /** Description or message in the dialog body. */
    description?: string;
    /** Label for the confirm button. */
    confirmLabel?: string;
    /** Label for the cancel button. */
    cancelLabel?: string;
    /** If you want to highlight the destructive nature of action. */
    destructive?: boolean;
};

export function ConfirmationDialog({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    destructive = true,
}: Readonly<ConfirmationDialogProps>) {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay
                    className={cn(
                        'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
                    )}
                />
                <AlertDialog.Content
                    className={cn(
                        'fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md',
                        'bg-white p-6 shadow-lg focus:outline-none',
                    )}
                >
                    <AlertDialog.Title className="mb-2 text-lg font-semibold">
                        {title}
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-muted-foreground mb-4 text-sm">
                        {description}
                    </AlertDialog.Description>

                    <div className="flex justify-end space-x-2">
                        <AlertDialog.Cancel
                            onClick={() => {
                                onOpenChange(false); // or setDeleteDialogOpen(false)
                                onCancel?.();
                            }}
                            className="text-xs"
                        >
                            {cancelLabel}
                        </AlertDialog.Cancel>
                        <AlertDialog.Action
                            onClick={onConfirm}
                            className={cn(
                                'inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium',
                                'text-white focus:outline-none',
                                destructive
                                    ? 'bg-destructive hover:bg-destructive/90'
                                    : 'bg-primary hover:bg-primary/90',
                            )}
                        >
                            {confirmLabel}
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
