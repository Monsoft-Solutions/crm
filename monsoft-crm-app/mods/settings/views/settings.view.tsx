import { ReactElement } from 'react';

import { api } from '@api/providers/web';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@ui/card.ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs.ui';

import { TwilioCredentialsForm } from '../components/twilio-credentials-form.component';
import { TwilioPhoneNumbersTable } from '../components/twilio-phone-numbers-table.component';

export function SettingsView(): ReactElement {
    const { data: credentials } = api.settings.getTwilioCredentials.useQuery();

    const { data: phoneNumbers } = api.settings.getOwnedPhoneNumbers.useQuery();

    if (!credentials) return <div />;

    const hasCredentials = Boolean(
        credentials.twilioSid && credentials.twilioToken,
    );

    return (
        <div className="h-screen grow overflow-y-auto p-6">
            <h1 className="mb-6 text-2xl font-semibold">Settings</h1>

            <Tabs defaultValue="twilio">
                <TabsList>
                    <TabsTrigger value="twilio">Twilio</TabsTrigger>
                </TabsList>

                <TabsContent value="twilio" className="mt-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Twilio Credentials</CardTitle>
                            <CardDescription>
                                Configure your Twilio Account SID and Auth Token
                                to enable SMS and voice features.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <TwilioCredentialsForm
                                initialSid={credentials.twilioSid}
                                initialToken={credentials.twilioToken}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Phone Numbers</CardTitle>
                            <CardDescription>
                                Phone numbers owned by your Twilio account and
                                their brand assignments.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <TwilioPhoneNumbersTable
                                phoneNumbers={phoneNumbers ?? []}
                                hasCredentials={hasCredentials}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
