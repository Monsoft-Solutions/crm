import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@css/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar.ui';

// Function to generate a consistent color based on a string (name)
function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use a predefined set of WhatsApp-like avatar background colors
    const colors = [
        '#25D366', // WhatsApp green
        '#128C7E', // WhatsApp dark green
        '#34B7F1', // WhatsApp blue
        '#075E54', // WhatsApp teal
        '#4CAF50', // Material green
        '#2196F3', // Material blue
        '#3F51B5', // Material indigo
        '#00BCD4', // Material cyan
    ];

    // Use the hash to pick a color from the predefined list
    return colors[Math.abs(hash) % colors.length];
}

export function ContactAvatar({
    name,
    className,
}: ComponentPropsWithoutRef<typeof Avatar> & { name: string }) {
    // Get first and last initials
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    const avatarColor = stringToColor(name);

    return (
        <Avatar className={cn('size-10 flex-shrink-0 rounded-full', className)}>
            <AvatarImage src={`/placeholder.svg?text`} alt={name} />
            <AvatarFallback
                className="text-sm font-medium text-white"
                style={{ backgroundColor: avatarColor }}
            >
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}
