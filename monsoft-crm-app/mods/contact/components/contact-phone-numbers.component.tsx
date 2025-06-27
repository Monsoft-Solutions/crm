import { Fragment } from 'react/jsx-runtime';

import { toast } from 'sonner';

import { Badge } from '@shared/ui/badge.ui';
import { Button } from '@shared/ui/button.ui';
import { Check, Plus, X } from 'lucide-react';

import { cn } from '@css/utils';

import { api, apiClientUtils } from '@api/providers/web';
import { Form, FormItem, FormField } from '@shared/ui/form.ui';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@shared/ui/input.ui';

export const ContactPhoneNumbers = ({ contactId }: { contactId: string }) => {
    const { data: contactPhoneNumbers } =
        api.contactChannel.getContactPhoneNumbers.useQuery({
            contactId,
        });

    const handleAddContactPhoneNumber = async (phoneNumber: string) => {
        await api.contactChannel.addContactPhoneNumber.mutate({
            contactId,
            phoneNumber,
        });

        toast.success('phone number added');

        await apiClientUtils.contactChannel.getContactPhoneNumbers.invalidate();

        newPhoneNumberForm.reset();
    };

    const handleSetDefaultContactPhoneNumber = async (
        phoneNumberId: string,
    ) => {
        await api.contactChannel.setDefaultContactPhoneNumber.mutate({
            phoneNumberId,
        });

        toast.success('default phone number updated');

        await apiClientUtils.contactChannel.getContactPhoneNumbers.invalidate();
    };

    const handleRemoveContactPhoneNumber = async (phoneNumberId: string) => {
        await api.contactChannel.removeContactPhoneNumber.mutate({
            phoneNumberId,
        });

        toast.success('phone number removed');

        await apiClientUtils.contactChannel.getContactPhoneNumbers.invalidate();
    };

    const newPhoneNumberFormSchema = z.object({
        phoneNumber: z.string().min(1),
    });

    const newPhoneNumberForm = useForm<
        z.infer<typeof newPhoneNumberFormSchema>
    >({
        resolver: zodResolver(newPhoneNumberFormSchema),
        defaultValues: {
            phoneNumber: '',
        },
    });

    if (!contactPhoneNumbers) return null;

    return (
        <>
            <div className="ml-2 grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-2">
                {contactPhoneNumbers.map(({ phoneNumber, id, isDefault }) => (
                    <Fragment key={id}>
                        <Badge variant="secondary" className="">
                            {phoneNumber}
                        </Badge>

                        <div className="flex items-center gap-x-1">
                            <Button
                                variant="destructive"
                                size="icon"
                                className={cn(
                                    'h-4 w-4',
                                    isDefault === 'true' && 'invisible',
                                )}
                                onClick={() =>
                                    void handleRemoveContactPhoneNumber(id)
                                }
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            <Button
                                variant={
                                    isDefault === 'true' ? 'default' : 'outline'
                                }
                                size="icon"
                                className="h-4 w-4"
                                onClick={() =>
                                    void handleSetDefaultContactPhoneNumber(id)
                                }
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                        </div>
                    </Fragment>
                ))}
            </div>

            <Form {...newPhoneNumberForm}>
                <form
                    onSubmit={(e) => {
                        void newPhoneNumberForm.handleSubmit(async (data) => {
                            await handleAddContactPhoneNumber(data.phoneNumber);
                        })(e);
                    }}
                    className="mt-4 ml-2 flex h-8 items-center gap-x-1"
                >
                    <FormField
                        control={newPhoneNumberForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <Input {...field} className="h-5.5" />
                            </FormItem>
                        )}
                    />

                    <Button
                        variant="default"
                        disabled={!newPhoneNumberForm.formState.isValid}
                        className="h-4 w-4 rounded-full px-0 py-0"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </form>
            </Form>
        </>
    );
};
