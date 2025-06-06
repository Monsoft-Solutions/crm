import { HTMLAttributes, useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

import { Moon, Sun, Monitor, Check } from 'lucide-react';

import { Button } from '@ui/button.ui';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@ui/dropdown-menu.ui';

import { cn } from '@css/utils';

type ThemeDropdownProps = HTMLAttributes<HTMLDivElement> & {
    align?: 'start' | 'center' | 'end';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    variant?: 'default' | 'outline' | 'ghost';
};

export function ThemeDropdown({
    className,
    align = 'end',
    size = 'icon',
    variant = 'outline',
    ...props
}: ThemeDropdownProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                variant={variant}
                size={size}
                className={cn('w-9 p-0', className)}
                disabled
            >
                <span className="bg-muted size-4 animate-pulse rounded-full" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={variant} size={size} className="w-9 p-0">
                        <Sun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />

                        <Moon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />

                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align={align}>
                    <DropdownMenuItem
                        onClick={() => {
                            setTheme('light');
                        }}
                    >
                        <Sun className="mr-2 size-4" />
                        <span>Light</span>
                        {theme === 'light' && (
                            <Check className="ml-auto size-4" />
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            setTheme('dark');
                        }}
                    >
                        <Moon className="mr-2 size-4" />
                        <span>Dark</span>
                        {theme === 'dark' && (
                            <Check className="ml-auto size-4" />
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            setTheme('system');
                        }}
                    >
                        <Monitor className="mr-2 size-4" />
                        <span>System</span>
                        {theme === 'system' && (
                            <Check className="ml-auto size-4" />
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
