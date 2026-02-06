import { forwardRef } from 'react';

import { intToOneDigitStr } from '@shared/utils/number';
import { timeToAgo } from '@shared/utils/tmp';

import { cn } from '@css/utils';

import { Check } from 'lucide-react';
import { Badge } from '@ui/badge.ui';
import { ContactAvatar } from '@mods/contact/components';

import { api } from '@api/providers/web';

export const ContactCard = forwardRef<
    HTMLDivElement,
    {
        contactId: string;
        expanded?: boolean;
        active?: boolean;
        onSelect?: () => void;
        isMobileView?: boolean;
    }
>(
    (
        {
            contactId,
            expanded = true,
            active = false,
            onSelect,
            isMobileView = false,
        },
        ref,
    ) => {
        const {
            data: contactCardSummary,
            error: contactCardSummaryError,
            isLoading: isLoadingContactCardSummary,
        } = api.contactMessage.getContactSummary.useQuery({
            contactId,
        });

        if (isLoadingContactCardSummary) return;
        if (contactCardSummaryError) return;

        const { contact, numUnreadInboundMessages, lastEvent } =
            contactCardSummary;

        const contactName = `${contact.firstName} ${contact.lastName}`;

        return (
            <div
                ref={ref}
                className={cn(
                    'border-border/50 relative flex cursor-pointer items-center border-b px-3 py-3 transition-colors',
                    'hover:bg-accent/70',
                    active && 'bg-primary/[0.07] border-l-primary border-l-2',
                )}
                onClick={() => {
                    onSelect?.();
                    void api.contactMessage.markAllContactInboundMessagesAsRead.mutate(
                        {
                            contactId,
                        },
                    );
                }}
                data-testid="contact-card"
            >
                {/* Avatar with online indicator */}
                <div className="relative flex-shrink-0">
                    <ContactAvatar
                        id={contactId}
                        firstName={contact.firstName}
                        lastName={contact.lastName}
                        className={cn(
                            'border-border border',
                            isMobileView ? 'h-12 w-12' : 'h-11 w-11',
                        )}
                    />
                </div>

                {expanded && (
                    <div className="ml-3 min-w-0 flex-1 overflow-hidden pr-1">
                        {/* Top row: Contact name and time */}
                        <div className="flex w-full items-center justify-between">
                            <p className="text-foreground max-w-[70%] truncate text-[0.9375rem] font-medium">
                                {contactName}
                            </p>

                            <div className="flex flex-shrink-0 items-center gap-1">
                                {/* Last message time in WhatsApp style */}
                                {
                                    <span className="text-muted-foreground min-w-[40px] text-right text-xs">
                                        {timeToAgo(lastEvent.timestamp)}
                                    </span>
                                }
                            </div>
                        </div>

                        {/* Bottom row: Message preview and badges */}
                        <div className="mt-0.5 flex w-full items-center justify-between">
                            {/* Last message preview with truncation */}
                            {lastEvent.type === 'message' && (
                                <div className="flex max-w-[60%] min-w-0 items-center gap-1">
                                    {/* Check mark for outbound messages (like WhatsApp) */}
                                    {lastEvent.message.direction ===
                                        'outbound' && (
                                        <Check className="stroke-primary size-3.5 flex-shrink-0" />
                                    )}

                                    {/* Message preview */}
                                    <p className="text-muted-foreground truncate text-xs">
                                        {lastEvent.message.body.length > 40
                                            ? lastEvent.message.body.substring(
                                                  0,
                                                  40,
                                              ) + '...'
                                            : lastEvent.message.body}
                                    </p>
                                </div>
                            )}

                            <div className="ml-1 flex flex-shrink-0 items-center gap-1">
                                {/* Unread count badge in WhatsApp style */}
                                {numUnreadInboundMessages > 0 && (
                                    <Badge className="ml-1 size-5 flex-shrink-0 justify-center rounded-full border-0 bg-emerald-500 p-0 text-xs text-white shadow-[0_0_8px_oklch(0.627_0.194_149/0.4)] dark:bg-emerald-400">
                                        {intToOneDigitStr(
                                            numUnreadInboundMessages,
                                        )}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    },
);

ContactCard.displayName = 'ContactCard';
