import { ReactElement } from 'react';

import { Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@api/providers/web';

import { Badge } from '@ui/badge.ui';
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

type WhatsappNumber = {
    id: string | null;
    phoneNumber: string;
    friendlyName: string;
    twilioSid: string | null;
    metaPhoneNumberId: string | null;
    senderStatus: 'creating' | 'offline' | 'online';
    isDefault: string | null;
    brandId: string | null;
    brandName: string | null;
    isSandbox: boolean;
};

type Brand = {
    id: string;
    name: string;
};

export function WhatsappSendersTable({
    whatsappNumbers,
    brands,
    onRefresh,
}: {
    whatsappNumbers: WhatsappNumber[];
    brands: Brand[];
    onRefresh: () => void;
}): ReactElement {
    const handleAssignBrand = async (
        phoneNumber: string,
        brandId: string | null,
    ) => {
        const { error } = await api.settings.assignWhatsappNumberBrand.mutate({
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
        const { error } =
            await api.settings.setDefaultBrandWhatsappNumber.mutate({
                phoneNumber,
            });

        if (error) {
            toast.error('Failed to set default WhatsApp number');
            return;
        }

        toast.success('Default WhatsApp number updated');
        onRefresh();
    };

    const handleRegister = async (phoneNumber: string) => {
        const { error } = await api.settings.registerWhatsappSender.mutate({
            phoneNumber,
        });

        if (error) {
            toast.error('Failed to register WhatsApp sender');
            return;
        }

        toast.success('WhatsApp sender registration initiated');
        onRefresh();
    };

    if (whatsappNumbers.length === 0) {
        return (
            <p className="text-muted-foreground text-sm">
                No phone numbers found. Purchase numbers to get started.
            </p>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Sender Status</TableHead>
                    <TableHead>Assigned Brand</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {whatsappNumbers.map((number) => (
                    <TableRow key={number.phoneNumber}>
                        <TableCell className="font-mono">
                            <span className="flex items-center gap-2">
                                {number.phoneNumber}

                                {number.isSandbox && (
                                    <Badge
                                        variant="outline"
                                        className="border-blue-300 text-blue-700"
                                    >
                                        Sandbox
                                    </Badge>
                                )}

                                {number.metaPhoneNumberId && (
                                    <Badge
                                        variant="outline"
                                        className="border-green-300 text-green-700"
                                    >
                                        Meta
                                    </Badge>
                                )}
                            </span>
                        </TableCell>

                        <TableCell>
                            <SenderStatusBadge status={number.senderStatus} />
                        </TableCell>

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

                        <TableCell>
                            {number.senderStatus === 'offline' &&
                                number.brandId &&
                                !number.isSandbox && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            void handleRegister(
                                                number.phoneNumber,
                                            )
                                        }
                                    >
                                        Register for WhatsApp
                                    </Button>
                                )}

                            {number.senderStatus === 'creating' && (
                                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Registering...
                                </div>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function SenderStatusBadge({
    status,
}: {
    status: 'creating' | 'offline' | 'online';
}): ReactElement {
    switch (status) {
        case 'online':
            return (
                <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                >
                    Online
                </Badge>
            );

        case 'creating':
            return (
                <Badge
                    variant="default"
                    className="bg-yellow-100 text-yellow-800"
                >
                    Creating
                </Badge>
            );

        case 'offline':
            return (
                <Badge variant="secondary" className="text-gray-600">
                    Offline
                </Badge>
            );
    }
}
