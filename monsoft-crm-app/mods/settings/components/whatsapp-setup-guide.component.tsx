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
    const [copiedSandbox, setCopiedSandbox] = useState(false);
    const [copiedMeta, setCopiedMeta] = useState(false);

    const sandboxWebhookUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}/twilio-sandbox`
            : '';

    const metaWebhookUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}/meta-event`
            : '';

    function handleCopySandbox() {
        void navigator.clipboard.writeText(sandboxWebhookUrl).then(() => {
            setCopiedSandbox(true);
            setTimeout(() => {
                setCopiedSandbox(false);
            }, 2000);
        });
    }

    function handleCopyMeta() {
        void navigator.clipboard.writeText(metaWebhookUrl).then(() => {
            setCopiedMeta(true);
            setTimeout(() => {
                setCopiedMeta(false);
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
                    Follow these steps to enable WhatsApp messaging via Twilio
                    Sandbox or Meta Cloud API.
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
                                    {sandboxWebhookUrl}
                                </code>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={handleCopySandbox}
                                >
                                    {copiedSandbox ? (
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
                        Meta Cloud API (Production)
                    </h4>

                    <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
                        <li>
                            Set up the WhatsApp Business API in the{' '}
                            <span className="font-medium">
                                Meta Business Dashboard
                            </span>
                            .
                        </li>
                        <li>
                            Copy your phone number ID and generate a permanent
                            access token.
                        </li>
                        <li>
                            Configure the Meta webhook URL to point to:
                            <span className="mt-1 flex items-center gap-2">
                                <code className="bg-muted rounded px-2 py-1 text-xs">
                                    {metaWebhookUrl}
                                </code>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={handleCopyMeta}
                                >
                                    {copiedMeta ? (
                                        <Check className="h-3 w-3" />
                                    ) : (
                                        <Copy className="h-3 w-3" />
                                    )}
                                </Button>
                            </span>
                        </li>
                        <li>
                            Add the Meta number below using{' '}
                            <span className="font-medium">
                                &ldquo;Add Meta Number&rdquo;
                            </span>
                            .
                        </li>
                        <li>
                            Set the number as default for your brand (star
                            icon).
                        </li>
                    </ol>
                </div>
            </CardContent>
        </Card>
    );
}
