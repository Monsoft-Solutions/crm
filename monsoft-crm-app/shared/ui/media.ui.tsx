import { HTMLAttributes } from 'react';

import { cn } from '@css/utils';

import { File } from '@shared/schemas';

export function Media({
    file: { type, base64 },
    className,
}: HTMLAttributes<HTMLImageElement | HTMLVideoElement | HTMLObjectElement> & {
    file: File;
}) {
    const data = `data:${type};base64,${base64}`;

    const renderMedia = () => {
        if (type.startsWith('image/')) {
            return (
                <img
                    src={data}
                    className={cn('', className)}
                    alt="Media content"
                />
            );
        } else if (type.startsWith('video/')) {
            return (
                <video controls className={cn('', className)}>
                    <source src={data} type={type} />
                    Your browser does not support the video tag.
                </video>
            );
        } else if (type === 'application/pdf') {
            return (
                <object
                    data={data}
                    type={type}
                    className={cn('', className)}
                ></object>
            );
        } else {
            return (
                <a href={data} download className={cn('', className)}>
                    Download File
                </a>
            );
        }
    };

    return <div className={cn('', className)}>{renderMedia()}</div>;
}
