import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@css/utils';
import { Button } from './button.ui';

export type PasswordInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type'
> & {
    hideToggle?: boolean;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, hideToggle = false, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    className={cn(
                        'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                {!hideToggle && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => {
                            setShowPassword(!showPassword);
                        }}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="text-muted-foreground h-4 w-4" />
                        ) : (
                            <Eye className="text-muted-foreground h-4 w-4" />
                        )}
                        <span className="sr-only">
                            {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                    </Button>
                )}
            </div>
        );
    },
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
