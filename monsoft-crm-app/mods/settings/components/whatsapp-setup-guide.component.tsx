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
            ? `${window.location.origin}/twilio-sandbox`
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
                        Quick Start (Sandbox Testing)
                    </h4>

                    <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
                        <li>
                            Assign the{' '}
                            <span className="font-mono font-medium">
                                WhatsApp Sandbox
                            </span>{' '}
                            number to your brand below.
                        </li>
                        <li>Set it as the default (star icon).</li>
                        <li>
                            In Twilio Console &rarr; Messaging &rarr; Try it out
                            &rarr; Send a WhatsApp message &rarr; Sandbox
                            settings, set both{' '}
                            <span className="font-medium">
                                &ldquo;When a message comes in&rdquo;
                            </span>{' '}
                            and{' '}
                            <span className="font-medium">
                                &ldquo;Status callback URL&rdquo;
                            </span>{' '}
                            to:
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
                            Find your sandbox join code on the same page in
                            Twilio Console.
                        </li>
                        <li>
                            Have recipients text{' '}
                            <span className="font-mono font-medium">
                                join &lt;your-keyword&gt;
                            </span>{' '}
                            to +14155238886 from their WhatsApp.
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
