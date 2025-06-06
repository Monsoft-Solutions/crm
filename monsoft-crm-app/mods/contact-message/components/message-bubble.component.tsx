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
                                'text-[10px] font-medium opacity-70',
                                direction === 'inbound'
                                    ? 'text-gray-500'
                                    : 'text-blue-600',
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
                                                'flex items-center justify-center opacity-60',
                                                direction === 'inbound'
                                                    ? 'text-gray-500'
                                                    : 'text-blue-500',
                                            )}
                                        >
                                            <ChannelIcon className="size-3.5" />
                                        </div>
                                    </TooltipTrigger>

                                    <TooltipContent className="bg-white text-black shadow-md">
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
                    'relative max-w-[85%] min-w-[150px] overflow-hidden rounded-2xl transition-all',
                    direction === 'outbound'
                        ? 'self-end bg-blue-50 shadow-sm hover:shadow'
                        : 'self-start bg-gray-100 text-gray-800 shadow-sm hover:shadow',
                )}
            >
                {messageBubbleContent}
            </div>
        );
    },
);

MessageBubble.displayName = 'MessageBubble';
