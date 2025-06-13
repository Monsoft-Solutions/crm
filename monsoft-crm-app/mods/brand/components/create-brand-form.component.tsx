import { useNavigate } from '@tanstack/react-router';

import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import { Button } from '@ui/button.ui';
import { InputAnimatedLabel } from '@shared/ui/input-animated-label.ui';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@ui/form.ui';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/ui/select.ui';

import {
    CreateBrand,
    createBrandSchema,
} from '@mods/brand/schemas/create-brand.schema';

import { api } from '@api/providers/web';

export function CreateBrandForm({
    availablePhoneNumbers,
}: {
    availablePhoneNumbers: string[];
}) {
    const navigate = useNavigate();

    const form = useForm<CreateBrand>({
        resolver: zodResolver(createBrandSchema),
        defaultValues: {
            name: '',
            phoneNumber: availablePhoneNumbers[0],
        },
    });

    const handleSubmit = async (values: CreateBrand) => {
        console.log(values);

        const { data: newBrand, error: newBrandError } =
            await api.brand.createBrand.mutate(values);

        if (newBrandError) {
            toast.error('Failed to create brand');
            return;
        }

        toast.success(`Brand ${values.name} created successfully`);

        const { brandId } = newBrand;

        await navigate({
            to: '/chat/$brandId',
            params: {
                brandId,
            },
        });
    };

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                    void form.handleSubmit(handleSubmit)(e);
                }}
            >
                {/* Full Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="grow">
                            <InputAnimatedLabel label="Brand Name" {...field} />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <FormLabel className="font-medium">
                                    Phone Number
                                </FormLabel>

                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl className="mb-0">
                                        <SelectTrigger className="rounded-md">
                                            <SelectValue placeholder="Select Phone Number" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {availablePhoneNumbers.map(
                                            (phoneNumber) => (
                                                <SelectItem
                                                    key={phoneNumber}
                                                    value={phoneNumber}
                                                >
                                                    {phoneNumber}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="h-9 self-end">
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}
