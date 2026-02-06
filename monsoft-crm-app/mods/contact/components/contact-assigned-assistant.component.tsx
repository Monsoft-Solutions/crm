import { ReactElement } from 'react';

import { toast } from 'sonner';

import { Spinner } from '@ui/spinner.ui';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/ui/select.ui';

import { api, apiClientUtils } from '@api/providers/web';

type ContactAssignedAssistantProps = {
    contactId: string;
};

export function ContactAssignedAssistant({
    contactId,
}: ContactAssignedAssistantProps): ReactElement {
    const { data: contact } = api.contact.getContact.useQuery({
        id: contactId,
    });

    const { data: assistantsIds, isLoading: isLoadingAssistants } =
        api.assistant.getBrandAssistantsIds.useQuery(
            { brandId: contact?.brandId ?? '' },
            { enabled: !!contact?.brandId },
        );

    const handleAssistantChange = async (value: string) => {
        const assistantId = value === 'none' ? null : value;

        try {
            await api.contact.updateContact.mutate({
                id: contactId,
                assistantId,
            });

            toast.success('Assistant updated');

            await apiClientUtils.contact.getContact.invalidate();
        } catch {
            toast.error('Failed to update assistant');
        }
    };

    if (!contact) return <></>;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                {isLoadingAssistants ? (
                    <Spinner className="h-4 w-4" />
                ) : (
                    <Select
                        value={contact.assistantId ?? 'none'}
                        onValueChange={(value) => {
                            void handleAssistantChange(value);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select assistant" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">
                                No assistant assigned
                            </SelectItem>
                            {assistantsIds?.map(({ id }) => (
                                <AssistantOption key={id} assistantId={id} />
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    );
}

function AssistantOption({
    assistantId,
}: {
    assistantId: string;
}): ReactElement {
    const { data: assistant } = api.assistant.getAssistant.useQuery({
        id: assistantId,
    });

    if (!assistant) return <></>;

    return <SelectItem value={assistantId}>{assistant.name}</SelectItem>;
}
