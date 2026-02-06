import { ReactElement } from 'react';

import { Link } from '@tanstack/react-router';

import type { UseFormReturn } from 'react-hook-form';

import type { LogInCredentials } from '@auth/schemas';

import { Button } from '@ui/button.ui';

import { Input } from '@ui/input.ui';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@ui/form.ui';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@ui/card.ui';

import { SocialLogIn } from './social-log-in.component';
import { PasswordInput } from '@shared/ui/password-input.ui';

// ----------------------------------------------------------------------

// Log-in form component
// Inputs fields: email, password
// Perform client-side validation
// When valid submition, log in user
// Dropdown menu for quick selection of bookmarked users
export function LogInForm({
    form,
    onSubmit,
}: {
    form: UseFormReturn<LogInCredentials>;
    onSubmit: (data: LogInCredentials) => void;
}): ReactElement {
    return (
        <Card className="w-full max-w-md border-none shadow-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-start text-2xl tracking-[-0.03em]">
                    Sign in to your account
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            void form.handleSubmit(onSubmit)(e);
                        }}
                        className="grid gap-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Email
                                    </FormLabel>
                                    <div className="relative flex items-center">
                                        <FormControl>
                                            <Input
                                                placeholder="email@example.com"
                                                className="h-11 rounded-md"
                                                type="email"
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="********"
                                            className="h-11 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="mt-6 h-11 w-full font-medium"
                        >
                            Log In
                        </Button>
                    </form>
                </Form>

                <SocialLogIn />
            </CardContent>

            <CardFooter className="flex justify-center border-t p-4">
                <span className="text-muted-foreground text-sm">
                    New to Monsoft CRM?{' '}
                </span>
                <Link to="/auth/sign-up">
                    <Button
                        variant="link"
                        className="text-primary hover:text-primary/80 px-1"
                    >
                        Create Account
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
