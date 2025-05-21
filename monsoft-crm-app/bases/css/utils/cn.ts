import { type ClassValue, clsx } from 'clsx';

import { twMerge } from 'tailwind-merge';

// utility to properly merge tailwind class names
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
