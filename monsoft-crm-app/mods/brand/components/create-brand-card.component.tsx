import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardDescription,
} from '@ui/card.ui';

import { CreateBrandForm } from './create-brand-form.component';

import { api } from '@api/providers/web';

export function CreateBrandCard() {
    const { data: availablePhoneNumbers } =
        api.brand.getAvailablePhoneNumbers.useQuery();

    if (!availablePhoneNumbers) return null;

    return (
        <Card className="container w-full max-w-md">
            <CardHeader className="mb-4">
                <CardTitle>Create Brand</CardTitle>
                <CardDescription>
                    a business that you manage contacts for.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <CreateBrandForm
                    availablePhoneNumbers={availablePhoneNumbers}
                />
            </CardContent>
        </Card>
    );
}
