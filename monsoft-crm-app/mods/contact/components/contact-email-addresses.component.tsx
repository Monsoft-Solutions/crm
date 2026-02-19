import { Fragment } from 'react/jsx-runtime';

import { toast } from 'sonner';

import { Badge } from '@shared/ui/badge.ui';
import { Button } from '@shared/ui/button.ui';
import { Plus, X } from 'lucide-react';

import { api, apiClientUtils } from '@api/providers/web';
import { Form, FormItem, FormField } from '@shared/ui/form.ui';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@shared/ui/input.ui';

export const ContactEmailAddresses = ({ contactId }: { contactId: string }) => {
    const { data: contactEmailAddresses } =
        api.contactChannel.getContactEmailAddresses.useQuery({
            contactId,
        });

    const handleAddContactEmailAddress = async (emailAddress: string) => {
        await api.contactChannel.addContactEmailAddress.mutate({
            contactId,
            emailAddress,
        });

        toast.success('Email address added');

        await apiClientUtils.contactChannel.getContactEmailAddresses.invalidate();
        await apiClientUtils.contactChannel.getAvailableContactChannels.invalidate();

        newEmailForm.reset();
    };

    const handleRemoveContactEmailAddress = async (emailAddressId: string) => {
        await api.contactChannel.removeContactEmailAddress.mutate({
            emailAddressId,
        });

        toast.success('Email address removed');

        await apiClientUtils.contactChannel.getContactEmailAddresses.invalidate();
        await apiClientUtils.contactChannel.getAvailableContactChannels.invalidate();
    };

    const newEmailFormSchema = z.object({
        emailAddress: z.string().min(1),
    });

    const newEmailForm = useForm<z.infer<typeof newEmailFormSchema>>({
        resolver: zodResolver(newEmailFormSchema),
        defaultValues: {
            emailAddress: '',
        },
    });

    if (!contactEmailAddresses) return null;

    return (
        <>
            <div className="ml-2 grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-2">
                {contactEmailAddresses.map(({ emailAddress, id }) => (
                    <Fragment key={id}>
                        <Badge variant="secondary">{emailAddress}</Badge>

                        <div className="flex items-center gap-x-1">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-4 w-4"
                                onClick={() =>
                                    void handleRemoveContactEmailAddress(id)
                                }
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </Fragment>
                ))}
            </div>

            <Form {...newEmailForm}>
                <form
                    onSubmit={(e) => {
                        void newEmailForm.handleSubmit(async (data) => {
                            await handleAddContactEmailAddress(
                                data.emailAddress,
                            );
                        })(e);
                    }}
                    className="mt-4 ml-2 flex h-8 items-center gap-x-1"
                >
                    <FormField
                        control={newEmailForm.control}
                        name="emailAddress"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <Input
                                    {...field}
                                    className="h-5.5"
                                    placeholder="email@example.com"
                                />
                            </FormItem>
                        )}
                    />

                    <Button
                        variant="default"
                        disabled={!newEmailForm.formState.isValid}
                        className="h-4 w-4 rounded-full px-0 py-0"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </form>
            </Form>
        </>
    );
};
