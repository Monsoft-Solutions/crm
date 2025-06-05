import { HTMLAttributes } from 'react';

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
    };

    const form = useForm<CreateContact>({
        resolver: zodResolver(ContactDataSchemaWithConstrains),

        defaultValues,
    });

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
            onClose={onClose}
            initEditMode={true}
            newEntityCreation={newEntityCreation}
            render={({ isEditMode, setIsSubmitting }) => (
                <ContactDetailsForm
                    form={form}
                    isEditMode={isEditMode}
                    setIsSubmitting={setIsSubmitting}
                    onSubmit={async (data) => {
                        await onSubmit(data);
                        onClose?.();
                    }}
                />
            )}
        >
            {children}
        </ViewEditDialog>
    );
}
