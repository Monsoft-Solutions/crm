import { Edit } from 'lucide-react';

import { Button } from '@ui/button.ui';
import { Badge } from '@ui/badge.ui';

import { Card, CardContent, CardHeader, CardTitle } from '@ui/card.ui';

import { CreateEditAssistantDialog } from './create-edit-assistant-dialog';

import { api, apiClientUtils } from '@api/providers/web';

type AssistantCardProps = {
    assistantId: string;
};

export function AssistantCard({ assistantId }: AssistantCardProps) {
    const {
        data: assistant,
        error: assistantError,
        isLoading: isLoadingAssistant,
    } = api.assistant.getAssistant.useQuery({ id: assistantId });

    const handleUpdateSuccess = async () => {
        await apiClientUtils.assistant.invalidate();
    };

    if (isLoadingAssistant || assistantError) return null;

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                    <CardTitle className="text-lg">{assistant.name}</CardTitle>
                </div>

                <CreateEditAssistantDialog
                    id={assistant.id}
                    assistant={assistant}
                    onSuccess={() => {
                        void handleUpdateSuccess();
                    }}
                >
                    <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                </CreateEditAssistantDialog>
            </CardHeader>

            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">{assistant.model}</Badge>
                        <Badge variant="outline">{assistant.tone}</Badge>
                        <Badge variant="outline">
                            {assistant.responseMode === 'auto_reply'
                                ? 'Auto Reply'
                                : 'Suggest Reply'}
                        </Badge>
                    </div>
                    <div>
                        <p className="mb-1 text-sm font-medium">
                            Instructions:
                        </p>
                        <p className="text-muted-foreground line-clamp-3 text-sm">
                            {assistant.instructions}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
