import { HTMLAttributes, useState } from 'react';

import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ContactDetailsForm } from './contact-details-form.component';

import {
    createContactSchema,
    CreateContact,
} from '../schemas/create-contact.schema';

import { ViewEditDialog } from '@shared/components/view-edit-dialog.component';

export const ContactDataSchemaWithConstrains: typeof createContactSchema =
    z.object({
        brandId: z.string(),
        firstName: z.string().min(1, 'first name cannot be empty'),
        lastName: z.string().min(1, 'last name cannot be empty'),
        phoneNumber: z
            .string()
            .regex(/^\+\d+$/, 'must start with + followed by numbers only'),
        emailAddress: z.string().email('invalid email address'),
    });

export function ContactDetailsDialog({
    brandId,
    contact,
    onSubmit,
    onClose,
    newEntityCreation = false,
    children,
}: Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> & {
    brandId: string;
    contact?: CreateContact;
    onSubmit: (data: CreateContact) => Promise<void>;
    onClose?: () => void;
    newEntityCreation?: boolean;
}) {
    const defaultValues: CreateContact = contact ?? {
        brandId,
        firstName: 'Jane',
        lastName: 'Doe',
        phoneNumber: '',
        emailAddress: '',
    };

    const form = useForm<CreateContact>({
        resolver: zodResolver(ContactDataSchemaWithConstrains),

        defaultValues,
    });

    const [isOpen, setIsOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        if (!open) onClose?.();
        setIsOpen(open);
    };

    return (
        <ViewEditDialog
            title="Contact Details"
            onSubmit={async () => {
                await form.trigger();
                await form.handleSubmit(onSubmit, (errors) => {
                    throw Error(
                        `invalid contact info ${JSON.stringify(errors)}`,
                    );
                })();
            }}
            isOpen={isOpen}
            handleOpenChange={handleOpenChange}
            initEditMode={true}
            newEntityCreation={newEntityCreation}
            render={({ isEditMode, setIsSubmitting }) => (
                <ContactDetailsForm
                    form={form}
                    isEditMode={isEditMode}
                    setIsSubmitting={setIsSubmitting}
                    onSubmit={async (data) => {
                        await onSubmit(data);
                        handleOpenChange(false);
                    }}
                />
            )}
        >
            {children}
        </ViewEditDialog>
    );
}
