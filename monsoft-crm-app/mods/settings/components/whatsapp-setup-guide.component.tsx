import { ReactElement } from 'react';

import { Info } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@ui/card.ui';

export function WhatsappSetupGuide(): ReactElement {
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

            <CardContent>
                <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
                    <li>
                        Ensure your Twilio credentials are configured in the
                        Twilio tab.
                    </li>
                    <li>
                        Search and purchase a phone number from the section
                        below.
                    </li>
                    <li>Register the purchased number as a WhatsApp sender.</li>
                    <li>
                        Wait for the sender status to become{' '}
                        <span className="font-medium text-green-600">
                            online
                        </span>
                        .
                    </li>
                    <li>Assign the number to a brand and set it as default.</li>
                </ol>
            </CardContent>
        </Card>
    );
}
