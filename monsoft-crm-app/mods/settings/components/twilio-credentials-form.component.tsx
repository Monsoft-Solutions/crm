import { ReactElement, useState } from 'react';

import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import { Loader2 } from 'lucide-react';

import { Button } from '@ui/button.ui';
import { InputAnimatedLabel } from '@shared/ui/input-animated-label.ui';

import { Form, FormField, FormItem } from '@ui/form.ui';

import { api } from '@api/providers/web';

import {
    UpdateTwilioCredentials,
    updateTwilioCredentialsSchema,
} from '../schemas';

export function TwilioCredentialsForm({
    initialSid,
    initialToken,
}: {
    initialSid: string;
    initialToken: string;
}): ReactElement {
    const [isTesting, setIsTesting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<UpdateTwilioCredentials>({
        resolver: zodResolver(updateTwilioCredentialsSchema),
        defaultValues: {
            twilioSid: initialSid,
            twilioToken: initialToken,
        },
    });

    const handleTestConnection = async () => {
        const values = form.getValues();

        if (!values.twilioSid || !values.twilioToken) {
            toast.error('Please enter both SID and Auth Token');
            return;
        }

        setIsTesting(true);

        const { data } = await api.settings.testTwilioConnection.mutate(values);

        setIsTesting(false);

        if (data.valid) {
            toast.success(`Connected to: ${data.accountName}`);
        } else {
            toast.error('Invalid credentials');
        }
    };

    const handleSubmit = async (values: UpdateTwilioCredentials) => {
        setIsSaving(true);

        await api.settings.updateTwilioCredentials.mutate(values);

        setIsSaving(false);

        toast.success('Twilio credentials saved');
    };

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                    void form.handleSubmit(handleSubmit)(e);
                }}
            >
                <FormField
                    control={form.control}
                    name="twilioSid"
                    render={({ field }) => (
                        <FormItem>
                            <InputAnimatedLabel
                                label="Account SID"
                                {...field}
                            />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="twilioToken"
                    render={({ field }) => (
                        <FormItem>
                            <InputAnimatedLabel
                                label="Auth Token"
                                type="password"
                                {...field}
                            />
                        </FormItem>
                    )}
                />

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isTesting}
                        onClick={() => {
                            void handleTestConnection();
                        }}
                    >
                        {isTesting && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Test Connection
                    </Button>

                    <Button type="submit" disabled={isSaving}>
                        {isSaving && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
}
