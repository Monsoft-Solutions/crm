import { useState } from 'react';

import { cn } from '@css/utils';

import { RefreshCcw } from 'lucide-react';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@ui/accordion.ui';

import { api, apiClientUtils } from '@api/providers/web';
import { Button } from '@ui/button.ui';
import { Badge } from '@ui/badge.ui';

import { ConversationFactsField } from '@mods/assistant/types';

import {
    conversationFactsFieldToIcon,
    conversationFactsFieldToTitle,
} from '../utils';

export function ConversationInsights({ contactId }: { contactId: string }) {
    const { data: conversationFacts } =
        api.assistant.getConversationFacts.useQuery({
            contactId,
        });

    const [isExtracting, setIsExtracting] = useState(false);

    const handleExtractConversationFacts = async () => {
        setIsExtracting(true);

        await api.assistant.extractConversationFacts.mutate({
            contactId,
        });

        await apiClientUtils.assistant.getConversationFacts.invalidate();

        setIsExtracting(false);
    };

    return (
        <div className="flex flex-col">
            <Button
                variant="outline"
                size="sm"
                className="justify-between"
                onClick={() => void handleExtractConversationFacts()}
            >
                <span>Extract insights</span>
                <RefreshCcw
                    className={cn('h-4 w-4', isExtracting && 'animate-spin')}
                />
            </Button>

            {conversationFacts &&
                Object.entries(conversationFacts).map(([field, value]) => {
                    if (!value || value.length === 0) return null;

                    const { data: title, error: titleError } =
                        conversationFactsFieldToTitle(
                            field as ConversationFactsField,
                        );

                    if (titleError) return null;

                    const { data: Icon, error: iconError } =
                        conversationFactsFieldToIcon(
                            field as ConversationFactsField,
                        );

                    if (iconError) return null;

                    return (
                        <Accordion
                            key={field}
                            type="single"
                            collapsible
                            className="border-none"
                        >
                            {
                                <AccordionItem value="topics-discussed">
                                    <AccordionTrigger className="py-3 transition-colors hover:bg-gray-50/80">
                                        <div className="flex items-center">
                                            <Icon className="text-primary/70 mr-2 h-5 w-5" />

                                            <h3 className="text-base font-medium">
                                                {title}
                                            </h3>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="flex flex-wrap gap-2 px-3 pt-3 pb-5">
                                        {value.map((topic, index) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                            >
                                                {topic}
                                            </Badge>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            }
                        </Accordion>
                    );
                })}
        </div>
    );
}
