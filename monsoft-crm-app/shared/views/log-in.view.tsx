import { ReactElement } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { type LogInCredentials, logInCredentialsSchema } from '@auth/schemas';

import { Route } from '@routes/_public/auth/log-in';

import { LogInForm } from '@shared/components/log-in-form.component';

// Log in view
// Render log in form
export function LogInView(): ReactElement {
    const {
        auth: { logIn },
    } = Route.useRouteContext();

    const { email } = Route.useSearch();

    const form = useForm<LogInCredentials>({
        resolver: zodResolver(logInCredentialsSchema),
        defaultValues: {
            email: email ?? '',
            password: '',
        },
    });

    return (
        <div className="from-background via-background to-primary/8 grid h-screen items-center justify-center bg-gradient-to-br">
            <LogInForm
                form={form}
                onSubmit={(credentials) => {
                    void logIn(credentials);
                }}
            />
        </div>
    );
}
