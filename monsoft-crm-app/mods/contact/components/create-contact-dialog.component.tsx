import { HTMLAttributes } from 'react';

import { toast } from 'sonner';

import { api, apiClientUtils } from '@api/providers/web';

import { Plus } from 'lucide-react';

import { Button } from '@ui/button.ui';

import { ContactDetailsDialog } from './contact-details-dialog.component';

export function CreateContactDialog({
    brandId,
    onClose,
    children,
}: HTMLAttributes<HTMLDivElement> & {
    brandId: string;
    onClose?: () => void;
}) {
    return (
        <ContactDetailsDialog
            brandId={brandId}
            onSubmit={async (data) => {
                const { error } = await api.contact.createContact.mutate(data);

                if (error) {
                    toast.error('Failed to create contact', {
                        description: 'Please try again.',
                    });
                    return;
                }

                toast('Contact successfully created', {
                    description: `you can now get in touch with ${data.firstName} !`,
                });

                onClose?.();

                await apiClientUtils.contact.getContactsIds.invalidate();

                return;
            }}
            onClose={() => {
                onClose?.();
            }}
            newEntityCreation={true}
        >
            {children ? (
                children
            ) : (
                <Button
                    variant="ghost"
                    size="sm"
                    className="bg-primary/10 text-primary hover:bg-primary/15 h-9 w-9 flex-shrink-0 rounded-full p-0"
                >
                    <Plus className="h-5 w-5" />
                </Button>
            )}
        </ContactDetailsDialog>
    );
}
