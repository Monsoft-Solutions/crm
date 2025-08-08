import { useEffect, useState } from 'react';

import { AlertCircle } from 'lucide-react';

import { Button } from '@shared/ui/button.ui';
import { Spinner } from '@ui/spinner.ui';

import { Card, CardContent, CardHeader, CardTitle } from '@ui/card.ui';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/ui/select.ui';

import { AssistantCard } from './assistant-card.component';

import { CreateEditAssistantDialog } from './create-edit-assistant-dialog';

import { api, apiClientUtils } from '@api/providers/web';

export function AssistantManagementDashboard() {
    const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(
        undefined,
    );

    const { data: brands, isLoading: brandsLoading } =
        api.brand.getBrands.useQuery();

    useEffect(() => {
        if (!brands) return;

        const firstBrand = brands.at(0);

        if (!firstBrand) return;

        const firstBrandId = firstBrand.id;

        setSelectedBrandId((prev) => prev ?? firstBrandId);
    }, [brands]);

    const {
        data: assistantsIds,
        error: assistantsIdsError,
        isLoading: isLoadingAssistantsIds,
    } = api.assistant.getBrandAssistantsIds.useQuery(
        { brandId: selectedBrandId ?? '' },
        { enabled: !!selectedBrandId },
    );

    const handleBrandChange = (brandId: string) => {
        setSelectedBrandId(brandId);
    };

    const handleUpdateSuccess = async () => {
        await apiClientUtils.assistant.getBrandAssistantsIds.invalidate();
    };

    if (brandsLoading) {
        return (
            <div className="flex h-48 items-center justify-center">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (!brands || brands.length === 0) {
        return (
            <Card className="w-full">
                <CardContent className="flex h-48 items-center justify-center">
                    <div className="text-center">
                        <AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                        <p className="text-lg font-medium">No brands found</p>
                        <p className="text-muted-foreground text-sm">
                            Create a brand first to manage assistants
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span>Assistant Management</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex items-center gap-4">
                        <div className="max-w-xs flex-1">
                            <Select
                                onValueChange={handleBrandChange}
                                value={selectedBrandId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a brand" />
                                </SelectTrigger>
                                <SelectContent>
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
                        </div>
                    </div>

                    {selectedBrandId && (
                        <div>
                            {isLoadingAssistantsIds ? (
                                <div className="flex h-32 items-center justify-center">
                                    <Spinner className="h-6 w-6" />
                                </div>
                            ) : assistantsIdsError ? (
                                <div className="py-8 text-center">
                                    <AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <p className="mb-2 text-lg font-medium">
                                        Error loading assistants
                                    </p>
                                </div>
                            ) : assistantsIds.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {assistantsIds.map(({ id }) => (
                                        <AssistantCard
                                            key={id}
                                            assistantId={id}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                    <p className="mb-2 text-lg font-medium">
                                        No assistants found
                                    </p>
                                    <p className="text-muted-foreground mb-4 text-sm">
                                        This brand doesn&apos;t have any
                                        assistants yet
                                    </p>

                                    <CreateEditAssistantDialog
                                        brandId={selectedBrandId}
                                        onSuccess={() => {
                                            void handleUpdateSuccess();
                                        }}
                                    >
                                        <Button>Create Assistant</Button>
                                    </CreateEditAssistantDialog>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
