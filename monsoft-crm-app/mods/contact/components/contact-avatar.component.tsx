import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@css/utils';

import { stringToColor } from '@shared/utils/string-to-color.util';

import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar.ui';

export function ContactAvatar({
    id,
    firstName,
    lastName,
    className,
}: ComponentPropsWithoutRef<typeof Avatar> & {
    id: string;
    firstName: string;
    lastName: string;
}) {
    const name = `${firstName} ${lastName}`;

    const initials =
        `${firstName.at(0) ?? ''}${lastName.at(0) ?? ''}`.toUpperCase();

    const avatarColor = stringToColor(id);

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
