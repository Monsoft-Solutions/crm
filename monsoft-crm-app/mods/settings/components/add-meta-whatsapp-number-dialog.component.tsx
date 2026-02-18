import { ReactElement, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { api } from '@api/providers/web';
import { apiClientUtils } from '@api/providers/web';

import { Button } from '@ui/button.ui';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@ui/dialog.ui';
import { Input } from '@ui/input.ui';
import { Label } from '@ui/label.ui';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@ui/select.ui';

import { addMetaWhatsappNumberSchema, AddMetaWhatsappNumber } from '../schemas';

type Brand = {
    id: string;
    name: string;
};

export function AddMetaWhatsappNumberDialog({
    brands,
}: {
    brands: Brand[];
}): ReactElement {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<AddMetaWhatsappNumber>({
        resolver: zodResolver(addMetaWhatsappNumberSchema),
        defaultValues: {
            phoneNumber: '',
            metaPhoneNumberId: '',
            brandId: '',
        },
    });

    const onSubmit = async (values: AddMetaWhatsappNumber) => {
        setSubmitting(true);

        const { error } =
            await api.settings.addMetaWhatsappNumber.mutate(values);

        setSubmitting(false);

        if (error) {
            toast.error('Failed to add Meta WhatsApp number');
            return;
        }

        toast.success('Meta WhatsApp number added');

        void apiClientUtils.settings.getWhatsappNumbers.invalidate();

        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Add Meta Number
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Meta WhatsApp Number</DialogTitle>
                    <DialogDescription>
                        Add a WhatsApp number configured through Meta Cloud API.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                    className="space-y-4"
                >
                    <div className="space-y-1">
                        <Label htmlFor="phoneNumber">Phone Number</Label>

                        <Input
                            id="phoneNumber"
                            placeholder="+1234567890"
                            {...register('phoneNumber')}
                        />

                        {errors.phoneNumber && (
                            <p className="text-destructive text-xs">
                                {errors.phoneNumber.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="metaPhoneNumberId">
                            Meta Phone Number ID
                        </Label>

                        <Input
                            id="metaPhoneNumberId"
                            placeholder="123456789012345"
                            {...register('metaPhoneNumberId')}
                        />

                        {errors.metaPhoneNumberId && (
                            <p className="text-destructive text-xs">
                                {errors.metaPhoneNumberId.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>Brand</Label>

                        <Select
                            onValueChange={(value) => {
                                setValue('brandId', value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>

                            <SelectContent>
                                {brands.map((brand) => (
                                    <SelectItem key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {errors.brandId && (
                            <p className="text-destructive text-xs">
                                {errors.brandId.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full"
                    >
                        {submitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Add Number
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
