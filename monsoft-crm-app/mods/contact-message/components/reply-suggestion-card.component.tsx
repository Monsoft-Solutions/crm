import type { ReactElement } from 'react';

import { cn } from '@css/utils';

import { Badge } from '@ui/badge.ui';
import { Card } from '@ui/card.ui';
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/tooltip.ui';

import type { CertaintyLevel } from '@mods/assistant/enums/certainty-level.enum';

type ReplySuggestionCardProps = {
    id: string;
    content: string;
    certaintyLevel: CertaintyLevel;
    onSelect: (id: string, content: string) => void;
};

const certaintyStyles: Record<CertaintyLevel, string> = {
    high: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    low: 'bg-muted text-muted-foreground',
};

export function ReplySuggestionCard({
    id,
    content,
    certaintyLevel,
    onSelect,
}: ReplySuggestionCardProps): ReactElement {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Card
                    className="bg-primary/[0.06] border-primary/10 hover:bg-primary/[0.1] min-w-0 flex-1 cursor-pointer rounded-xl border p-3 shadow-none transition-colors"
                    onClick={() => {
                        onSelect(id, content);
                    }}
                >
                    <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-3 text-sm leading-snug">
                            {content}
                        </p>

                        <Badge
                            className={cn(
                                'shrink-0 text-[10px] font-medium',
                                certaintyStyles[certaintyLevel],
                            )}
                        >
                            {certaintyLevel}
                        </Badge>
                    </div>
                </Card>
            </TooltipTrigger>

            <TooltipContent
                side="top"
                className="max-w-80 text-sm whitespace-pre-wrap"
            >
                {content}
            </TooltipContent>
        </Tooltip>
    );
}
