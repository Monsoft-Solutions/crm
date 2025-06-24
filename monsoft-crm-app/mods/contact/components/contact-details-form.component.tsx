import { UseFormReturn } from 'react-hook-form';

import { Form, FormField, FormItem, FormMessage } from '@ui/form.ui';

import { InputAnimatedLabel } from '@shared/ui/input-animated-label.ui';

import { CreateContact } from '../schemas/create-contact.schema';

export function ContactDetailsForm({
    form,
    onSubmit,
    isEditMode,
    setIsSubmitting,
}: {
    form: UseFormReturn<CreateContact>;
    onSubmit: (data: CreateContact) => Promise<void>;
    isEditMode: boolean;
    setIsSubmitting: (isSubmitting: boolean) => void;
}) {
    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    setIsSubmitting(true);

                    void form
                        .handleSubmit(onSubmit, () => {
                            setIsSubmitting(false);
                        })(e)
                        .catch(() => {
                            setIsSubmitting(false);
                        });
                }}
            >
                <div
                    className={`grid grid-cols-2 gap-8 transition-all duration-500 ease-in-out ${isEditMode ? 'scale-[1.02] transform' : ''}`}
                >
                    {/* Full Name */}
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <InputAnimatedLabel
                                    label="First Name"
                                    {...field}
                                    readOnly={!isEditMode}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Last Name */}
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <InputAnimatedLabel
                                    label="Last Name"
                                    {...field}
                                    readOnly={!isEditMode}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone */}
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <InputAnimatedLabel
                                    label="Phone"
                                    type="tel"
                                    {...field}
                                    readOnly={!isEditMode}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="emailAddress"
                        render={({ field }) => (
                            <FormItem>
                                <InputAnimatedLabel
                                    label="Email"
                                    type="email"
                                    {...field}
                                    readOnly={!isEditMode}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <button type="submit" className="hidden" />
            </form>
        </Form>
    );
}
