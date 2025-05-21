import { ReactElement } from 'react';

import { Link } from '@tanstack/react-router';

import type { UseFormReturn } from 'react-hook-form';

import type { SignUpForm } from '@auth/schemas';

import { Button } from '@shared/ui/button.ui';

import { Input } from '@shared/ui/input.ui';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@shared/ui/form.ui';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@shared/ui/card.ui';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/ui/select.ui';

import { ShortInfoMessage } from '@shared/components/short-info-message.component';

import { SocialLogIn } from './social-log-in.component';
import { PasswordInput } from '@shared/ui/password-input.ui';

// ----------------------------------------------------------------------

// Sign up form component
// Inputs fields: firstName, lastName, email, password, language
export function SignUpForm({
    form,
    onSubmit,
}: {
    form: UseFormReturn<SignUpForm>;
    onSubmit: (data: SignUpForm) => void;
}): ReactElement {
    return (
        <Card className="w-full max-w-md border-none shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">
                    Create your Monsoft CRM Account
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            void form.handleSubmit(onSubmit)(e);
                        }}
                        className="grid gap-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        First Name
                                    </FormLabel>

                                    <div className="relative flex items-center">
                                        <FormControl>
                                            <Input
                                                placeholder="John"
                                                className="h-11 rounded-md"
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
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Last Name
                                    </FormLabel>

                                    <div className="relative flex items-center">
                                        <FormControl>
                                            <Input
                                                placeholder="Doe"
                                                className="h-11 rounded-md"
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

                        <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Language
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-11 rounded-md">
                                                <SelectValue placeholder="Select Language" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="en">
                                                English
                                            </SelectItem>
                                            <SelectItem value="es">
                                                Spanish
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 mt-4 h-11 w-full font-medium"
                        >
                            Create Account
                        </Button>
                    </form>
                </Form>

                <SocialLogIn />
            </CardContent>

            <CardFooter className="flex justify-center border-t p-4">
                <ShortInfoMessage>
                    Already have an account?{' '}
                    <Link to="/auth/log-in">
                        <Button
                            variant="link"
                            className="px-1 text-blue-600 hover:text-blue-700"
                        >
                            Log In
                        </Button>
                    </Link>
                </ShortInfoMessage>
            </CardFooter>
        </Card>
    );
}
