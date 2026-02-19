import { useCallback, useRef, useState, type ReactElement } from 'react';

import { skipToken } from '@tanstack/react-query';

import { Mail, Send, Sparkles, LoaderIcon } from 'lucide-react';

import { toast } from 'sonner';

import { Button } from '@ui/button.ui';
import { Input } from '@ui/input.ui';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@ui/sheet.ui';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@ui/select.ui';

import { api } from '@api/providers/web';

import type { EmailDraftTone } from '../schemas';

import { TiptapEditor } from './tiptap-editor.component';

export function EmailComposeDrawer({
    open,
    onOpenChange,
    contactId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contactId: string;
}): ReactElement {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [tone, setTone] = useState<EmailDraftTone>('professional');
    const [isSending, setIsSending] = useState(false);
    const [isDrafting, setIsDrafting] = useState(false);

    const accumulatedRef = useRef('');

    // AI draft subscription — only active when isDrafting is true
    api.contactMessage.onDraftEmailWithAi.useSubscription(
        isDrafting
            ? {
                  contactId,
                  subject: subject || undefined,
                  tone,
              }
            : skipToken,
        {
            onData: (chunk: string) => {
                accumulatedRef.current += chunk;
                setBody(accumulatedRef.current);
            },
            onError: () => {
                toast.error('Failed to generate draft');
                setIsDrafting(false);
            },
        },
    );

    const handleSend = useCallback(async () => {
        if (!body.trim()) return;

        setIsSending(true);

        try {
            await api.contactMessage.sendMessageToContact.mutate({
                contactId,
                channelType: 'email',
                body,
                subject: subject || undefined,
            });

            setSubject('');
            setBody('');
            onOpenChange(false);
            toast.success('Email sent');
        } catch {
            toast.error('Failed to send email');
        } finally {
            setIsSending(false);
        }
    }, [contactId, subject, body, onOpenChange]);

    const handleDraftWithAi = useCallback(() => {
        if (isDrafting) {
            setIsDrafting(false);
            return;
        }

        accumulatedRef.current = '';
        setBody('');
        setIsDrafting(true);
    }, [isDrafting]);

    const canSend = body.trim().length > 0;
    const isBusy = isSending || isDrafting;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="mx-auto flex h-[85vh] max-h-[700px] w-full max-w-2xl flex-col rounded-t-2xl sm:max-w-2xl"
            >
                <SheetHeader className="shrink-0 pb-0">
                    <SheetTitle className="flex items-center gap-2 text-base">
                        <Mail className="size-4" />
                        Compose Email
                    </SheetTitle>

                    <SheetDescription className="sr-only">
                        Compose and send an email to this contact
                    </SheetDescription>
                </SheetHeader>

                <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4">
                    {/* Subject */}
                    <Input
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => {
                            setSubject(e.target.value);
                        }}
                        disabled={isBusy}
                        className="shrink-0"
                    />

                    {/* AI controls */}
                    <div className="flex shrink-0 items-center gap-2">
                        <Select
                            value={tone}
                            onValueChange={(v) => {
                                setTone(v as EmailDraftTone);
                            }}
                            disabled={isBusy}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="professional">
                                    Professional
                                </SelectItem>

                                <SelectItem value="friendly">
                                    Friendly
                                </SelectItem>

                                <SelectItem value="brief">Brief</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant={isDrafting ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={handleDraftWithAi}
                            disabled={isSending}
                        >
                            <Sparkles className="mr-1.5 size-3.5" />
                            {isDrafting ? 'Stop' : 'Draft with AI'}
                        </Button>
                    </div>

                    {/* Editor */}
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <TiptapEditor
                            content={body}
                            onUpdate={setBody}
                            className="h-full"
                        />
                    </div>

                    {/* Send */}
                    <div className="flex shrink-0 items-center justify-end gap-2 pt-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                onOpenChange(false);
                            }}
                            disabled={isBusy}
                        >
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            onClick={() => {
                                void handleSend();
                            }}
                            disabled={!canSend || isBusy}
                        >
                            {isSending ? (
                                <LoaderIcon className="mr-1.5 size-3.5 animate-spin" />
                            ) : (
                                <Send className="mr-1.5 size-3.5" />
                            )}
                            Send Email
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
