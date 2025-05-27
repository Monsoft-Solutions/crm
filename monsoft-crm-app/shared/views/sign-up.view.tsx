import { z } from 'zod';

import { ReactElement } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

import {
    signUpFormSchema,
    type SignUpForm as SignUpFormType,
} from '@auth/schemas';

import { SignUpForm } from '@shared/components/sign-up-form.component';

import { langCodeEnum } from '@lang/enum';

import { authClient } from '@auth/providers/web';

const signUpFormSchemaValidated: typeof signUpFormSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    language: langCodeEnum,
});

// Sign up view
// Render sign up form
export function SignUpView(): ReactElement {
    const navigate = useNavigate();

    const form = useForm<SignUpFormType>({
        resolver: zodResolver(signUpFormSchemaValidated),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            language: 'en',
        },
    });

    const handleSubmit = async (data: SignUpFormType) => {
        const { error: errorSigningUp } = await authClient.signUp.email({
            name: data.firstName,
            email: data.email,
            password: data.password,
            lastName: data.lastName,
        });

        if (errorSigningUp) {
            toast.error('Error signing up');
            return;
        }

        toast.success('Signed up successfully');

        await navigate({ to: '/auth/waiting-email-verification' });
    };

    return (
        <div className="flex h-full flex-col overflow-auto bg-gray-50">
            {/* Main content container */}
            <div className="flex flex-1 flex-col md:flex-row">
                {/* Left side - Form */}
                <div className="flex w-full flex-col items-center justify-center bg-white p-4 pb-16 md:w-1/2 md:p-8">
                    <SignUpForm
                        form={form}
                        onSubmit={(data) => void handleSubmit(data)}
                    />
                </div>
            </div>
        </div>
    );
}
