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

import { industryEnum, companySizeEnum } from '@mods/brand/enums';

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
            domain: '',
            whatsappPhoneId: '',
            whatsappPhoneNumber: '',
            description: '',
            industry: industryEnum.options.at(0),
            companySize: companySizeEnum.options.at(0),
            foundedYear: 2000,
        },
    });

    const handleSubmit = async (values: CreateBrand) => {
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

                <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                        <FormItem className="grow">
                            <InputAnimatedLabel
                                label="Internet Domain"
                                {...field}
                            />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="whatsappPhoneId"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <InputAnimatedLabel
                                    label="Whatsapp Phone ID"
                                    {...field}
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="whatsappPhoneNumber"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <InputAnimatedLabel
                                    label="Whatsapp Phone Number"
                                    {...field}
                                />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Brand Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="grow">
                            <InputAnimatedLabel
                                label="Brand Description (optional)"
                                {...field}
                            />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    {/* Founded Year */}
                    <FormField
                        control={form.control}
                        name="foundedYear"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <InputAnimatedLabel
                                    label="Founded Year"
                                    type="number"
                                    {...field}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        field.onChange(value);
                                    }}
                                />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-4">
                    {/* Industry */}
                    <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <FormLabel className="font-medium">
                                    Industry
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl className="mb-0">
                                        <SelectTrigger className="rounded-md">
                                            <SelectValue placeholder="Select Industry" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {industryEnum.options.map(
                                            (industry) => (
                                                <SelectItem
                                                    key={industry}
                                                    value={industry}
                                                >
                                                    {industry.replace(
                                                        /_/g,
                                                        ' ',
                                                    )}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    {/* Company Size */}
                    <FormField
                        control={form.control}
                        name="companySize"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <FormLabel className="font-medium">
                                    Company Size
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl className="mb-0">
                                        <SelectTrigger className="rounded-md">
                                            <SelectValue placeholder="Select Company Size" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {companySizeEnum.options.map((size) => (
                                            <SelectItem key={size} value={size}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem className="grow">
                                <FormLabel className="font-medium">
                                    SMS Phone Number
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
