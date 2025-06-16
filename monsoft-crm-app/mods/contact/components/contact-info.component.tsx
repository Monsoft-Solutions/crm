import { toast } from 'sonner';

import { EditableText } from '@ui/editable-text.ui';

import { UpdateContact } from '../schemas';

import { api, apiClientUtils } from '@api/providers/web';

export const ContactInfo = ({ contactId }: { contactId: string }) => {
    const { data: contact } = api.contact.getContact.useQuery({
        id: contactId,
    });

    const handleUpdateContact = async (details: UpdateContact) => {
        await api.contact.updateContact.mutate({
            id: contactId,
            ...details,
        });

        showToast();

        await apiClientUtils.contact.getContact.invalidate();
        await apiClientUtils.contactMessage.getContactSummary.invalidate();
    };

    const showToast = () => {
        toast.success('contact updated');
    };

    if (!contact) return null;

    return (
        <div className="ml-2 grid grid-cols-2 items-center gap-y-0">
            <span className="w-max font-semibold">First Name</span>
            <EditableText
                initialText={contact.firstName}
                onSave={async (firstName) => {
                    await handleUpdateContact({
                        firstName,
                    });
                }}
            />

            <span className="w-max font-semibold">Last Name</span>
            <EditableText
                initialText={contact.lastName}
                onSave={async (lastName) => {
                    await handleUpdateContact({
                        lastName,
                    });
                }}
            />
        </div>
    );
};
