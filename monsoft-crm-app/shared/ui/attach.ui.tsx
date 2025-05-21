import { ButtonHTMLAttributes, useRef } from 'react';

import { toast } from 'sonner';

import { cn } from '@css/utils';

import { Button } from './button.ui';

import { File } from '@shared/schemas';

import { getFileBase64 } from '@shared/utils/get-file-base64.util';

export function Attach({
    children,
    className,
    disabled,
    setAttachment,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
    setAttachment: (file: File[]) => void;
}) {
    const hiddenFileInput = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // if any files are selected
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

            // Check if any file exceeds the size limit
            const oversizedFiles = files.filter(
                (file) => file.size > MAX_FILE_SIZE,
            );

            if (oversizedFiles.length > 0) {
                toast.error('Files must be less than 5MB each');
                return;
            }

            setAttachment(
                await Promise.all(
                    files.map(async (file) => ({
                        name: file.name,
                        type: file.type,
                        base64: await getFileBase64(file),
                    })),
                ),
            );
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Attach file"
            onClick={() => {
                // clear previously selected files, if any
                if (hiddenFileInput.current) hiddenFileInput.current.value = '';

                // open file selection dialog
                hiddenFileInput.current?.click();
            }}
            className={cn('', className)}
            disabled={disabled}
            type="button"
            {...props}
        >
            {children}

            <input
                type="file"
                multiple
                className="hidden"
                ref={hiddenFileInput}
                onChange={(e) => {
                    void handleFileChange(e);
                }}
            />
        </Button>
    );
}
