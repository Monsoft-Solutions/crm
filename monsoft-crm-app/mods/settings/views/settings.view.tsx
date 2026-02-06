import { ReactElement } from 'react';

import { RefreshCw } from 'lucide-react';

import { api } from '@api/providers/web';
import { apiClientUtils } from '@api/providers/web';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@ui/card.ui';
import { Button } from '@ui/button.ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs.ui';

import { PageHeader } from '@shared/components/page-header.component';

import { ThemeSelector } from '@ui/theme-selector.ui';

import { TwilioCredentialsForm } from '../components/twilio-credentials-form.component';
import { TwilioPhoneNumbersTable } from '../components/twilio-phone-numbers-table.component';

export function SettingsView(): ReactElement {
    const { data: credentials } = api.settings.getTwilioCredentials.useQuery();

    const { data: phoneNumbers } = api.settings.getOwnedPhoneNumbers.useQuery();

    const { data: brands } = api.brand.getBrands.useQuery();

    if (!credentials) return <div />;

    const hasCredentials = Boolean(
        credentials.twilioSid && credentials.twilioToken,
    );

    return (
        <div className="grow overflow-y-auto p-6">
            <PageHeader
                title="Settings"
                description="Manage your account and application preferences"
            />

            <Tabs defaultValue="twilio">
                <TabsList>
                    <TabsTrigger value="twilio">Twilio</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
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
                            <div className="flex items-center gap-2">
                                <CardTitle>Phone Numbers</CardTitle>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                        void apiClientUtils.settings.getOwnedPhoneNumbers.invalidate()
                                    }
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>

                            <CardDescription>
                                Phone numbers owned by your Twilio account and
                                their brand assignments.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <TwilioPhoneNumbersTable
                                phoneNumbers={phoneNumbers ?? []}
                                hasCredentials={hasCredentials}
                                brands={brands ?? []}
                                onRefresh={() =>
                                    void apiClientUtils.settings.getOwnedPhoneNumbers.invalidate()
                                }
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="mt-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme</CardTitle>
                            <CardDescription>
                                Choose your preferred color scheme. System will
                                follow your OS preference.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <ThemeSelector type="both" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
