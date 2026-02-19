import { forwardRef, useState, type ReactElement } from 'react';

import DOMPurify from 'dompurify';

import { cn } from '@css/utils';

import { ChevronDown, ChevronUp, Mail } from 'lucide-react';

import { Button } from '@ui/button.ui';

import { timeToHMEpochStr } from '@shared/utils/tmp';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@shared/ui/tooltip.ui';

import { contactMessageStatusToIcon } from '@mods/contact-channel/utils';

import { MessageBubbleProps } from '../schemas';

const PREVIEW_LENGTH = 120;

const ALLOWED_TAGS = [
    'p',
    'br',
    'strong',
    'em',
    'a',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'blockquote',
    'span',
    'div',
];

const ALLOWED_ATTR = ['href', 'target', 'rel'];

export const EmailMessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
    ({ subject, body, direction, createdAt, status }, ref): ReactElement => {
        const [isExpanded, setIsExpanded] = useState(false);

        const StatusIcon = contactMessageStatusToIcon(status);

        const plainText = body.replace(/<[^>]*>/g, '');
        const needsTruncation = plainText.length > PREVIEW_LENGTH;
        const preview = needsTruncation
            ? plainText.slice(0, PREVIEW_LENGTH) + '\u2026'
            : plainText;

        const isHtml = body !== plainText;

        // Sanitize HTML content with DOMPurify to prevent XSS
        const sanitizedHtml = isHtml
            ? DOMPurify.sanitize(body, {
                  ALLOWED_TAGS,
                  ALLOWED_ATTR,
              })
            : '';

        return (
            <div
                ref={ref}
                className={cn(
                    'relative max-w-[85%] min-w-[220px] overflow-hidden rounded-2xl transition-all',
                    direction === 'outbound'
                        ? 'bg-primary/[0.08] border-primary/[0.15] self-end border shadow-sm hover:shadow'
                        : 'bg-muted text-foreground border-border/40 self-start border shadow-sm hover:shadow',
                )}
            >
                <div className="w-full">
                    {/* Email header */}
                    <div
                        className={cn(
                            'flex items-center gap-2 border-b px-3 pt-3 pb-2',
                            direction === 'outbound'
                                ? 'border-primary/10'
                                : 'border-border/30',
                        )}
                    >
                        <Mail
                            className={cn(
                                'size-3.5 shrink-0',
                                direction === 'outbound'
                                    ? 'text-primary/60'
                                    : 'text-muted-foreground/60',
                            )}
                        />

                        <p className="text-sm font-semibold leading-tight">
                            {subject || '(no subject)'}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="px-3 pt-2 pb-1">
                        {isExpanded ? (
                            isHtml ? (
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed break-words"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizedHtml,
                                    }}
                                />
                            ) : (
                                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                    {body}
                                </p>
                            )
                        ) : (
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {preview}
                            </p>
                        )}

                        {needsTruncation && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground mt-1 h-auto px-0 py-0.5 text-xs font-medium"
                                onClick={() => {
                                    setIsExpanded((prev) => !prev);
                                }}
                            >
                                {isExpanded ? (
                                    <>
                                        <ChevronUp className="mr-1 size-3" />
                                        Collapse
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="mr-1 size-3" />
                                        Show full email
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex w-full items-center justify-end gap-1.5 px-3 pb-2">
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
                                        <Mail className="size-3.5" />
                                    </div>
                                </TooltipTrigger>

                                <TooltipContent className="bg-popover text-popover-foreground shadow-md">
                                    <p className="text-xs">Email</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {direction === 'outbound' && (
                            <span className="opacity-70">
                                <StatusIcon className="size-3.5" />
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    },
);

EmailMessageBubble.displayName = 'EmailMessageBubble';
