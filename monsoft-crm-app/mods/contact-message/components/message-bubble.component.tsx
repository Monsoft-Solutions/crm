import { forwardRef } from 'react';

import { cn } from '@css/utils';

import { timeToHMEpochStr } from '@shared/utils/tmp';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@shared/ui/tooltip.ui';

import {
    communicationChannelTypeToIcon,
    communicationChannelTypeToTooltip,
} from '@mods/contact-channel/utils';

import { MessageBubbleProps } from '../schemas';

import { contactMessageStatusToIcon } from '@mods/contact-channel/utils';

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
    ({ body, direction, createdAt, channelType, status }, ref) => {
        const lines = body.split('\n');

        const ChannelIcon = communicationChannelTypeToIcon(channelType);

        const StatusIcon = contactMessageStatusToIcon(status);

        const channelTooltip = communicationChannelTypeToTooltip(channelType);

        const messageBubbleContent = (
            <div className="w-full p-3 pb-2">
                <div>
                    <p className="text-sm leading-relaxed break-words">
                        {lines.map((line, i) => (
                            <span key={i}>
                                {line}
                                {i < lines.length - 1 && <br />}
                            </span>
                        ))}
                    </p>
                </div>

                <div
                    ref={ref}
                    className="mt-1 flex w-full items-center justify-end gap-1.5"
                >
                    <>
                        <p
                            className={cn(
                                'font-tabular text-[10px] font-medium',
                                direction === 'inbound'
                                    ? 'text-muted-foreground/70'
                                    : 'text-primary/70',
                            )}
                        >
                            {timeToHMEpochStr(createdAt)}
                        </p>

                        {/* Channel icon with tooltip */}
                        {
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                'flex items-center justify-center',
                                                direction === 'inbound'
                                                    ? 'text-muted-foreground/60'
                                                    : 'text-primary/60',
                                            )}
                                        >
                                            <ChannelIcon className="size-3.5" />
                                        </div>
                                    </TooltipTrigger>

                                    <TooltipContent className="bg-popover text-popover-foreground shadow-md">
                                        <p className="text-xs">
                                            {channelTooltip}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        }

                        {direction === 'outbound' && (
                            <span className="opacity-70">
                                <StatusIcon className="size-3.5" />
                            </span>
                        )}
                    </>
                </div>
            </div>
        );

        return (
            <div
                className={cn(
                    'relative max-w-[85%] min-w-[150px] overflow-hidden rounded-[1.25rem] transition-all',
                    direction === 'outbound'
                        ? 'bg-primary/[0.08] border-primary/[0.06] self-end border shadow-sm hover:shadow'
                        : 'bg-muted text-foreground border-border/30 self-start border shadow-sm hover:shadow',
                )}
            >
                {messageBubbleContent}
            </div>
        );
    },
);

MessageBubble.displayName = 'MessageBubble';
