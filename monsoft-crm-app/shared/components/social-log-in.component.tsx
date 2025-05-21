import { authClient } from '@auth/providers/web/auth-client.provider';

import { FaGoogle } from 'react-icons/fa';

import { Button } from '@ui/button.ui';

export function SocialLogIn() {
    return (
        <>
            <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>

                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button
                variant="outline"
                type="button"
                className="mt-6 h-11 w-full font-medium"
                onClick={() => {
                    void authClient.signIn.social({
                        provider: 'google',
                    });
                }}
            >
                <FaGoogle className="mr-2 h-4 w-4" />
                Google
            </Button>
        </>
    );
}
