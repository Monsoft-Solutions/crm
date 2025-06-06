import { useCallback, useEffect, useRef, useState } from 'react';

import { File } from '@shared/schemas';

import { Paperclip, Send, X, LoaderIcon } from 'lucide-react';

import { Button } from '@ui/button.ui';
import { Badge } from '@ui/badge.ui';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@ui/dropdown-menu.ui';

import {
    AutosizeTextAreaRef,
    TextareaAutosize,
} from '@ui/text-area-autosize.ui';

import { Attach } from '@ui/attach.ui';

import { cn } from '@css/utils';

import { api } from '@api/providers/web';
import {
    ContactChannelType,
    contactChannelTypeEnum,
} from '@mods/contact-channel/enums';
import {
    communicationChannelTypeToIcon,
    communicationChannelTypeToTooltip,
} from '@mods/contact-channel/utils';
import { Thumbnail } from '@shared/ui/thumbnail.ui';

export function MessageInput({
    activeContactId,
    initText,
}: {
    activeContactId?: string;
    initText?: string;
}) {
    const { mutateAsync: sendMessageAsync } =
        api.contactMessage.sendMessageToContact.useMutation();

    const [newMessage, setNewMessage] = useState('');

    const [attachments, setAttachments] = useState<File[]>([]);

    const [isSending, setIsSending] = useState(false);

    const [selectedChannel, setSelectedChannel] =
        useState<ContactChannelType>('sms');

    const sendMessage = useCallback(async () => {
        if (activeContactId === undefined) return;

        await sendMessageAsync({
            contactId: activeContactId,
            channelType: selectedChannel,
            body: newMessage,
        });
    }, [activeContactId, selectedChannel, newMessage, sendMessageAsync]);

    const removeAttachment = useCallback((name: string) => {
        setAttachments((prev) => {
            return prev.filter((f) => f.name !== name);
        });
    }, []);

    useEffect(() => {
        if (initText) {
            setNewMessage((prev) => prev + initText);
        }
    }, [initText]);

    const numAttachments = attachments.length;
    const canSend = newMessage.trim() !== '' || numAttachments > 0;

    const textAreaRef = useRef<AutosizeTextAreaRef | null>(null);

    const handleSendMessage = useCallback(async () => {
        if (canSend) {
            setIsSending(true);
            await sendMessage();
            setIsSending(false);

            setNewMessage('');
            setAttachments([]);

            textAreaRef.current?.textArea.focus();
        }
    }, [sendMessage, canSend]);

    const handleNewMessageChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setNewMessage(event.target.value);
        },
        [],
    );

    const handleKeyPress = useCallback(
        async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                await handleSendMessage();
            }
        },
        [handleSendMessage],
    );

    const ChannelIcon = communicationChannelTypeToIcon(selectedChannel);

    return (
        <>
            <div className="flex items-center border-t bg-white p-2 px-4">
                <div className="relative">
                    <Attach
                        asChild
                        className="relative overflow-visible"
                        setAttachment={setAttachments}
                        disabled={isSending}
                    >
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 rounded-full p-0 hover:bg-gray-100"
                        >
                            <Paperclip className="h-4 w-4 text-gray-500" />
                        </Button>
                    </Attach>

                    {numAttachments > 0 && (
                        <>
                            <Badge
                                variant="default"
                                className="absolute -top-0.5 -right-0.5 flex size-4 cursor-default items-center justify-center rounded-full px-0 py-0 text-[10px]"
                            >
                                {numAttachments > 9 ? '9+' : numAttachments}
                            </Badge>

                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-0 left-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 p-0 shadow-sm"
                                onClick={() => {
                                    setAttachments([]);
                                }}
                            >
                                <X className="size-2.5" />
                            </Button>
                        </>
                    )}
                </div>

                <TextareaAutosize
                    ref={textAreaRef}
                    placeholder="Type a message..."
                    className="mx-2 flex-1 rounded-2xl border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-0 focus:ring-offset-0"
                    maxHeight={200}
                    value={newMessage}
                    onChange={handleNewMessageChange}
                    onKeyDown={(e) => {
                        void handleKeyPress(e);
                    }}
                    disabled={isSending}
                />

                <div className="flex space-x-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 rounded-full p-0 hover:bg-gray-100"
                                disabled={isSending}
                            >
                                <div className="flex items-center justify-center">
                                    <ChannelIcon className="size-4" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-32">
                            {contactChannelTypeEnum.options.map(
                                (channelType) => {
                                    const ChannelIcon =
                                        communicationChannelTypeToIcon(
                                            channelType,
                                        );

                                    const channelTooltip =
                                        communicationChannelTypeToTooltip(
                                            channelType,
                                        );

                                    return (
                                        <DropdownMenuItem
                                            key={channelType}
                                            onClick={() => {
                                                setSelectedChannel(channelType);
                                            }}
                                            className="flex items-center gap-2 py-1.5"
                                        >
                                            <ChannelIcon className="size-4" />

                                            <span className="text-xs font-medium">
                                                {channelTooltip}
                                            </span>
                                        </DropdownMenuItem>
                                    );
                                },
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        size="sm"
                        variant={canSend ? 'default' : 'ghost'}
                        className={cn(
                            'h-9 w-9 rounded-full p-0',
                            canSend
                                ? 'bg-primary hover:bg-primary/90'
                                : 'hover:bg-gray-100',
                        )}
                        aria-label="Send message"
                        onClick={() => {
                            void handleSendMessage();
                        }}
                        disabled={!canSend || isSending}
                    >
                        {isSending ? (
                            <LoaderIcon className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {attachments.length > 0 && (
                <div className="flex gap-2 border-t bg-gray-50 p-2 px-4">
                    {attachments.map((file, idx) => (
                        <div key={idx} className="group relative">
                            <Thumbnail file={file} />

                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 opacity-90 shadow group-hover:opacity-100"
                                onClick={() => {
                                    removeAttachment(file.name);
                                }}
                            >
                                <X className="h-2 w-2" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
