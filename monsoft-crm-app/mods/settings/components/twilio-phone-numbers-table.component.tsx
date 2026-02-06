import { ReactElement } from 'react';

import { Star } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@api/providers/web';

import { Button } from '@ui/button.ui';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@ui/table.ui';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@ui/select.ui';

type PhoneNumber = {
    phoneNumber: string;
    friendlyName: string;
    sid: string;
    brandName: string | null;
    brandId: string | null;
    isDefault: string | null;
};

type Brand = {
    id: string;
    name: string;
};

export function TwilioPhoneNumbersTable({
    phoneNumbers,
    hasCredentials,
    brands,
    onRefresh,
}: {
    phoneNumbers: PhoneNumber[];
    hasCredentials: boolean;
    brands: Brand[];
    onRefresh: () => void;
}): ReactElement {
    const handleAssignBrand = async (
        phoneNumber: string,
        brandId: string | null,
    ) => {
        const { error } = await api.settings.assignPhoneNumberBrand.mutate({
            phoneNumber,
            brandId,
        });

        if (error) {
            toast.error('Failed to update brand assignment');
            return;
        }

        toast.success('Brand assignment updated');
        onRefresh();
    };

    const handleSetDefault = async (phoneNumber: string) => {
        const { error } = await api.settings.setDefaultBrandPhoneNumber.mutate({
            phoneNumber,
        });

        if (error) {
            toast.error('Failed to set default phone number');
            return;
        }

        toast.success('Default phone number updated');
        onRefresh();
    };

    if (!hasCredentials) {
        return (
            <p className="text-muted-foreground text-sm">
                Configure your Twilio credentials above to view phone numbers.
            </p>
        );
    }

    if (phoneNumbers.length === 0) {
        return (
            <p className="text-muted-foreground text-sm">
                No phone numbers found in your Twilio account.
            </p>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Friendly Name</TableHead>
                    <TableHead>Assigned Brand</TableHead>
                    <TableHead>Default</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {phoneNumbers.map((number) => (
                    <TableRow key={number.sid}>
                        <TableCell className="font-mono">
                            {number.phoneNumber}
                        </TableCell>

                        <TableCell>{number.friendlyName}</TableCell>

                        <TableCell>
                            <Select
                                value={number.brandId ?? 'unassigned'}
                                onValueChange={(value) =>
                                    void handleAssignBrand(
                                        number.phoneNumber,
                                        value === 'unassigned' ? null : value,
                                    )
                                }
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="unassigned">
                                        Unassigned
                                    </SelectItem>

                                    {brands.map((brand) => (
                                        <SelectItem
                                            key={brand.id}
                                            value={brand.id}
                                        >
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TableCell>

                        <TableCell>
                            {number.brandId ? (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        void handleSetDefault(
                                            number.phoneNumber,
                                        )
                                    }
                                >
                                    <Star
                                        className={
                                            number.isDefault === 'true'
                                                ? 'fill-current text-yellow-500'
                                                : 'text-muted-foreground'
                                        }
                                        size={16}
                                    />
                                </Button>
                            ) : null}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
