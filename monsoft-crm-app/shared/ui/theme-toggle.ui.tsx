import { HTMLAttributes, useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

import { Moon, Sun } from 'lucide-react';

import { Switch } from '@ui/switch.ui';

import { cn } from '@css/utils';

type ThemeToggleProps = HTMLAttributes<HTMLDivElement> & {
    align?: 'horizontal' | 'vertical';
};

export function ThemeToggle({
    className,
    align = 'horizontal',
    ...props
}: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    if (!mounted) {
        return (
            <div
                className={cn(
                    'animate-pulse opacity-70',
                    align === 'horizontal'
                        ? 'flex items-center gap-2'
                        : 'flex flex-col items-center gap-1',
                    className,
                )}
                {...props}
            >
                <div className="bg-muted size-4 rounded-full" />
                <div className="bg-muted h-[1.15rem] w-8 rounded-full" />
                <div className="bg-muted size-4 rounded-full" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                align === 'horizontal'
                    ? 'flex items-center gap-2'
                    : 'flex flex-col items-center gap-1',
                className,
            )}
            {...props}
        >
            <Sun
                className={cn(
                    'size-4 transition-opacity',
                    theme === 'dark' ? 'opacity-50' : 'opacity-100',
                )}
            />
            <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                aria-label="Toggle theme"
            />
            <Moon
                className={cn(
                    'size-4 transition-opacity',
                    theme === 'light' ? 'opacity-50' : 'opacity-100',
                )}
            />
        </div>
    );
}
