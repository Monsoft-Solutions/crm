import { ReactElement, useState } from 'react';

import { Loader2, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@ui/table.ui';

const searchFormSchema = z.object({
    countryCode: z.string().min(1),
    areaCode: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

type AvailableNumber = {
    phoneNumber: string;
    friendlyName: string;
    capabilities: Record<string, boolean>;
};

export function PurchasePhoneNumberDialog(): ReactElement {
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState<AvailableNumber[]>([]);
    const [searching, setSearching] = useState(false);
    const [purchasing, setPurchasing] = useState<string | null>(null);

    const { register, handleSubmit } = useForm<SearchFormValues>({
        resolver: zodResolver(searchFormSchema),
        defaultValues: {
            countryCode: 'US',
            areaCode: '',
        },
    });

    const handleSearch = async (values: SearchFormValues) => {
        setSearching(true);
        setResults([]);

        const { data, error } =
            await api.settings.searchAvailablePhoneNumbers.mutate({
                countryCode: values.countryCode,
                areaCode: values.areaCode ?? undefined,
            });

        setSearching(false);

        if (error) {
            toast.error('Failed to search phone numbers');
            return;
        }

        setResults(data);
    };

    const handlePurchase = async (phoneNumber: string) => {
        setPurchasing(phoneNumber);

        const { error } = await api.settings.purchasePhoneNumber.mutate({
            phoneNumber,
        });

        setPurchasing(null);

        if (error) {
            toast.error('Failed to purchase phone number');
            return;
        }

        toast.success(`Purchased ${phoneNumber}`);

        void apiClientUtils.settings.getOwnedPhoneNumbers.invalidate();

        setOpen(false);
        setResults([]);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Buy Phone Number
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Buy Phone Number</DialogTitle>
                    <DialogDescription>
                        Search for available phone numbers and purchase one for
                        your account.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => void handleSubmit(handleSearch)(e)}
                    className="flex items-end gap-3"
                >
                    <div className="space-y-1">
                        <Label htmlFor="countryCode">Country</Label>

                        <Input
                            id="countryCode"
                            placeholder="US"
                            {...register('countryCode')}
                            className="w-20"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="areaCode">Area Code</Label>

                        <Input
                            id="areaCode"
                            placeholder="415"
                            {...register('areaCode')}
                            className="w-24"
                        />
                    </div>

                    <Button type="submit" disabled={searching}>
                        {searching ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                        Search
                    </Button>
                </form>

                {results.length > 0 && (
                    <div className="max-h-64 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {results.map((number) => (
                                    <TableRow key={number.phoneNumber}>
                                        <TableCell className="font-mono">
                                            {number.phoneNumber}
                                        </TableCell>

                                        <TableCell>
                                            {number.friendlyName}
                                        </TableCell>

                                        <TableCell>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    void handlePurchase(
                                                        number.phoneNumber,
                                                    )
                                                }
                                                disabled={
                                                    purchasing ===
                                                    number.phoneNumber
                                                }
                                            >
                                                {purchasing ===
                                                number.phoneNumber ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    'Buy'
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {!searching && results.length === 0 && (
                    <p className="text-muted-foreground text-center text-sm">
                        Search for numbers to see results.
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}
