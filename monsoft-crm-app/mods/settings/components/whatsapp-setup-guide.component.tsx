import { ReactElement, useState } from 'react';

import { Check, Copy, Info } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@ui/card.ui';

import { Button } from '@ui/button.ui';

export function WhatsappSetupGuide(): ReactElement {
    const [copied, setCopied] = useState(false);

    const webhookUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}/twilio-event`
            : '';

    function handleCopy() {
        void navigator.clipboard.writeText(webhookUrl).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        });
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Info className="text-muted-foreground h-5 w-5" />
                    <CardTitle>WhatsApp Setup Guide</CardTitle>
                </div>

                <CardDescription>
                    Follow these steps to enable WhatsApp messaging via Twilio.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <h4 className="mb-2 text-sm font-medium">
                        Twilio WhatsApp Setup
                    </h4>

                    <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
                        <li>
                            Purchase a WhatsApp-enabled phone number in Twilio
                            Console or use the number manager below.
                        </li>
                        <li>
                            Register the number as a WhatsApp sender in Twilio
                            Console &rarr; Messaging &rarr; WhatsApp senders.
                        </li>
                        <li>
                            Configure the Twilio Event Streams webhook URL to:
                            <span className="mt-1 flex items-center gap-2">
                                <code className="bg-muted rounded px-2 py-1 text-xs">
                                    {webhookUrl}
                                </code>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={handleCopy}
                                >
                                    {copied ? (
                                        <Check className="h-3 w-3" />
                                    ) : (
                                        <Copy className="h-3 w-3" />
                                    )}
                                </Button>
                            </span>
                            <span className="text-muted-foreground mt-1 block text-xs">
                                For local development, use your ngrok or tunnel
                                URL instead.
                            </span>
                        </li>
                        <li>
                            Assign the number to your brand below and set it as
                            default (star icon).
                        </li>
                        <li>
                            Open a contact&apos;s conversation, select the
                            WhatsApp channel, and send a message.
                        </li>
                    </ol>
                </div>

                <div>
                    <h4 className="mb-2 text-sm font-medium">
                        Production Setup
                    </h4>

                    <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
                        <li>
                            Ensure your Twilio credentials are configured in the
                            Twilio tab.
                        </li>
                        <li>
                            Search and purchase a phone number from the section
                            below.
                        </li>
                        <li>
                            Register the purchased number as a WhatsApp sender.
                        </li>
                        <li>
                            Wait for the sender status to become{' '}
                            <span className="font-medium text-green-600">
                                online
                            </span>
                            .
                        </li>
                        <li>
                            Assign the number to a brand and set it as default.
                        </li>
                    </ol>
                </div>
            </CardContent>
        </Card>
    );
}
